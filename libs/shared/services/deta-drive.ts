import { Deta } from 'deta';
import DetaClass from 'deta/dist/types/deta';
import DriveClass from 'deta/dist/types/drive';

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
    const { nanoid } = await import('nanoid'); // nanoid is esm-only and doesn't play well w/ CommonJS. Need to dyanamically import

    const newFileName = `${nanoid()}_${name}`;
    let imageData = file;

    if (file.buffer && !Buffer.isBuffer(file.buffer)) {
      imageData = await file.arrayBuffer();
      imageData = new Uint8Array(imageData);
    }

    if (file.buffer && Buffer.isBuffer(file.buffer)) {
      imageData = new Uint8Array(file.buffer);
    }

    try {
      const image = await this.drive.put(newFileName, {
        data: imageData,
        contentType: type,
      });
      return image;
    } catch (error) {
      console.log(error);
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
