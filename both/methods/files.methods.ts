import { UploadFS } from 'meteor/jalik:ufs';
import { FilesStore } from '../collections/files.collection';

export function upload(data: File): Promise<any> {
  return new Promise((resolve, reject) => {
    // pick from an object only: name, type and size
    const file = {
      name: data.name,
      type: data.type,
      size: data.size,
    };

    const upload = new UploadFS.Uploader({
      data,
      file,
      store: FilesStore,
      onError: reject,
      onComplete: resolve
    });

    upload.start();
  });
}
