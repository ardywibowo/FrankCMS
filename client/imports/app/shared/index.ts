import { DisplayMainImagePipe } from "./display-main-image.pipe";
import { DisplayCoverArtPipe } from "./display-cover-art.pipe";
import { FileURLPipe } from "./file-url.pipe";

export const SHARED_DECLARATIONS: any[] = [
  DisplayMainImagePipe,
  DisplayCoverArtPipe,
  FileURLPipe
];
