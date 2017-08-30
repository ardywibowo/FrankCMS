import { OnDestroy, OnInit, Input } from "@angular/core";
import { Observable, Subscription, Subject } from "rxjs";

import { Artwork, Category } from "../../../../both/models/artwork.model";
import { Album } from '../../../../both/models/album.model';
import { Artworks } from "../../../../both/collections/artworks.collection";
import { ImagesStore, Images } from "../../../../both/collections/images.collection";
import { FilesStore, Files } from "../../../../both/collections/files.collection";
import { Albums } from '../../../../both/collections/albums.collection';
import { MdSnackBar } from '@angular/material';

import { PaginationService } from "ng2-pagination";
import { MeteorObservable } from "meteor-rxjs";

import { Counts } from "meteor/tmeasday:publish-counts";
import { InjectUser } from "angular2-meteor-accounts-ui";

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any
}

@InjectUser('user')
export class ArtworksList implements OnInit, OnDestroy {
  @Input() itemsPerPage: number;
  @Input() albumId: string;
  @Input() notInAlbumId: string;
  @Input() category: Category = Category.Any;
  @Input() showPrivate: Boolean = false;

  artworksSize: number = 0;
  artworks: Observable<Artwork[]>;
  artworksSub: Subscription;
  albumsSubs: Subscription;
  imagesSubs: Subscription;
  filesSubs: Subscription;
  optionsSub: Subscription;
  autorunSub: Subscription;

  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  dateOrder: Subject<number> = new Subject<number>();

  user: Meteor.User;

  constructor(private paginationService: PaginationService, public snackBar: MdSnackBar) { }

  ngOnInit() {
    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();
    this.filesSubs = MeteorObservable.subscribe('files').subscribe();

    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.dateOrder
    ).subscribe(([pageSize, curPage, dateOrder]) => {
      const options: Options = {
        limit: pageSize as number,
        skip: ((curPage as number) - 1) * (pageSize as number),
        sort: { uploadDate: dateOrder as number }
      };

      this.paginationService.setCurrentPage(this.paginationService.defaultId(), curPage as number);

      if (this.artworksSub) {
        this.artworksSub.unsubscribe();
      }

      let artworkSelector: any;
      if (this.albumId && this.albumId != "") {
        this.albumsSubs = MeteorObservable.subscribe('albums').subscribe(() => {
          const album: Album = Albums.findOne(this.albumId);

          if (this.notInAlbumId && this.notInAlbumId != "") {
            const notInAlbum: Album = Albums.findOne(this.notInAlbumId);
            artworkSelector = { _id: { 
                $and: [{
                  $in: album.artworks 
                }, {
                  $nin: notInAlbum.artworks
                }]
              }
            };
          } else {
            artworkSelector = { _id: { $in: album.artworks } };
          }
          this.findArtworks(artworkSelector, options);
        });
      } else {
        if (this.category == Category.Any)
          artworkSelector = {};
        else
          artworkSelector = { category: this.category };

        if (this.notInAlbumId && this.notInAlbumId != "") {
          const notInAlbum: Album = Albums.findOne(this.notInAlbumId);
          artworkSelector._id = { $nin: notInAlbum.artworks };
        }
        if (!this.showPrivate) {
          artworkSelector.private = false;
        }
        this.findArtworks(artworkSelector, options);
      }
    });

    this.paginationService.register({
      id: this.paginationService.defaultId(),
      itemsPerPage: this.itemsPerPage,
      currentPage: 1,
      totalItems: this.artworksSize
    });

    this.pageSize.next(this.itemsPerPage);
    this.curPage.next(1);
    this.dateOrder.next(1);

    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
      this.artworksSize = Counts.get('numberOfArtworks');
      this.paginationService.setTotalItems(this.paginationService.defaultId(), this.artworksSize);
    });
  }

  findArtworks(artworkSelector: any, options: Options) {
    this.artworksSub = MeteorObservable.subscribe('artworks', options).subscribe(() => {
      this.artworks = Artworks.find(artworkSelector, {
        sort: {
          "uploadDate": -1
        }
      }).zone();
    });
  }

  search(value: string): void {
    this.curPage.next(1);
  }

  onPageChanged(page: number): void {
    this.curPage.next(page);
  }

  removeArtwork(artwork: Artwork) {
    if (!Meteor.userId()) {
      this.snackBar.open('Please log in to remove this artwork', 'Close');
      return;
    }

    if (artwork.albumsIn != null) {
      for (let album of artwork.albumsIn) {
        Albums.update(album, {
          $pull: {
            artworks: artwork._id
          }
        })

        let albumArtworks: Album = Albums.findOne(album, { fields: { coverArt: 1, artworks: 1 } });
        if (albumArtworks) {
          if (albumArtworks.artworks.length == 0) {
            Albums.remove(albumArtworks._id);
          } else if (albumArtworks.coverArt == artwork._id) {
            Albums.update(album, {
              $set: {
                coverArt: albumArtworks.artworks[0]
              }
            })
          }
        }
      }
    }
    
    for (let image of artwork.images) {
      Images.remove({_id: image});
    }
    for (let file of artwork.files) {
      Files.remove(file);
    }
    Artworks.remove(artwork._id);
  }

  updateArtwork(artwork: Artwork) {
    if (!Meteor.userId()) {
      this.snackBar.open('Please log in to update artworks', 'Close');
      return;
    }

    Artworks.update(artwork._id, {
      $set: {
        name: artwork.name,
        description: artwork.description,
        private: artwork.private,
        category: artwork.category
      }
    });
  }

  ngOnDestroy() {
    this.artworksSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
    this.imagesSubs.unsubscribe();
    this.filesSubs.unsubscribe();

    if (this.albumsSubs) {
      this.albumsSubs.unsubscribe();
    }
  }
}
