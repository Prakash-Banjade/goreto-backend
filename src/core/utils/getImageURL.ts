import { FileSystemStoredFile } from "nestjs-form-data";
require('dotenv').config();

export default function getImageURL(file: FileSystemStoredFile | string | undefined) {
    if (!file) return null;

    if (file instanceof FileSystemStoredFile) {
        const pathSegments = file?.path.split('\\');
        const fileName = pathSegments[pathSegments.length - 1];
        const imageName = fileName?.split('/').at(-1);

        return process.env.BACKEND_URL + '/' + imageName;
    } else return file;
}