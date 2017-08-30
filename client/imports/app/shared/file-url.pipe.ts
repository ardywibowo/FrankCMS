import { Pipe, PipeTransform } from '@angular/core';
import { Files } from '../../../../both/collections/files.collection';
import { Artwork } from '../../../../both/models/artwork.model';
import { Meteor } from "meteor/meteor";

@Pipe({
  name: 'fileUrl'
})
export class FileURLPipe implements PipeTransform {
  transform(artwork: Artwork) {
    if (!artwork) {
      return;
    }

    let fileUrl: string;
    let fileId: string = (artwork.files || [])[0];

    const found = Files.findOne(fileId);
    if (found) {
      if (!Meteor.isCordova) {
        fileUrl = found.url;
      } else {
        const path = `ufs/${found.store}/${found._id}/${found.name}`;
        fileUrl = Meteor.absoluteUrl(path);
      }
    }
    return fileUrl;
  }
}
