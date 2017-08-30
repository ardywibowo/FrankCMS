import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import template from './dashboard-upload.component.html';
import style from './dashboard-upload.component.scss';

import { upload } from '../../../../../both/methods/images.methods';
import { upload as uploadFile } from '../../../../../both/methods/files.methods';
import { Subject, Subscription, Observable } from "rxjs";
import { MeteorObservable } from "meteor-rxjs";
import { Thumb } from "../../../../../both/models/image.model";
import { Thumbs } from "../../../../../both/collections/images.collection";

@Component({
  selector: 'dashboard-upload',
  template,
  styles: [style]
})
export class DashboardUploadComponent implements OnInit {
  fileIsOver: boolean = false;
  uploading: boolean = false;
  filesArray: string[] = [];
  files: Subject<string[]> = new Subject<string[]>();
  thumbsSubscription: Subscription;
  thumbs: Observable<Thumb[]>;
  @Output() onFile: EventEmitter<any> = new EventEmitter<any>();

  isImage: boolean = true;

  constructor() { }

  ngOnInit() {
    this.files.subscribe((filesArray) => {
      MeteorObservable.autorun().subscribe(() => {
        if (this.thumbsSubscription) {
          this.thumbsSubscription.unsubscribe();
          this.thumbsSubscription = undefined;
        }

        this.thumbsSubscription = MeteorObservable.subscribe("thumbs", filesArray).subscribe(() => {
          this.thumbs = Thumbs.find({
            originalStore: 'images',
            originalId: {
              $in: filesArray
            }
          }).zone();
        });
      });
    });
  }

  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  onFileDrop(file: File): void {
    this.uploading = true;
    //Upload Image
    upload(file)
      .then((result) => {
        this.uploading = false;
        this.isImage = true;
        this.addFile(result);
      })
      .catch((error) => {
        // Upload File
        uploadFile(file)
          .then((result) => {
            this.uploading = false;
            this.isImage = false;
            this.addFile(result);
          })
          .catch((error) => {
            console.log(`Something went wrong!`, error);
            this.uploading = false;
          });
      });
  }

  addFile(file) {
    this.filesArray.push(file._id);
    this.files.next(this.filesArray);

    let emission: any = {};
    emission.id = file._id;
    emission.isImage = this.isImage;
    this.onFile.emit(emission);
  }

  reset() {
    this.filesArray = [];
    this.files.next(this.filesArray);
  }
}
