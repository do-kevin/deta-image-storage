import { nanoid } from 'nanoid';
import { Deta } from 'deta';
import DetaClass from 'deta/dist/types/deta';
import DriveClass from 'deta/dist/types/drive';

/* Deta Cloud has deprecated. Need to migrate to Deta Space and that has CORS policy.
 *   So we need to do the uploading logic in the server, not in the client.
 */

export class DetaDrive {
  deta: DetaClass;
  drive: DriveClass;

  constructor(projectKey: string, driveName: string) {
    this.deta = Deta(projectKey);
    this.drive = this.deta.Drive(driveName);
  }

  async createDrive(name: string) {
    this.deta.Drive(name);
  }

  async uploadImage(
    file: any,
    {
      uploader_id,
      name,
      type,
    }: {
      uploader_id?: string;
      name: string;
      type: string;
    }
  ) {
    // We need to check "name"'s extension and lowercase it. E.g. picture.JPG -> picture.jpg
    const newFileName = `${nanoid()}_${name}`;

    let imageData = await file.arrayBuffer();

    console.log('imageData: ', imageData);

    imageData = new Uint8Array(imageData);

    console.log('imageData: ', imageData);

    try {
      const image = await this.drive.put(newFileName, {
        data: imageData,
        contentType: type,
      });

      console.log('image: ', image);
    } catch (e) {
      console.log(e);
    }
  }

  async getImage(fileName: string) {
    try {
      const image = await this.drive.get(fileName);

      if (!image) {
        return null;
      }

      const buffer = await image.arrayBuffer();

      const blob = new Blob([buffer], { type: 'image/jpeg' });
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(blob);

      return imageUrl;
    } catch (error) {
      console.log(error);
    }
  }
}
