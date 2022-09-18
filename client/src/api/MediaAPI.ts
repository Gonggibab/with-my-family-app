import HttpRequest from 'api/HttpRequest';
import { AxiosRequestHeaders } from 'axios';

export const MediaAPI = {
  upload: async (files: File[], postId: string) => {
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    const header: AxiosRequestHeaders = {
      'content-type': 'multipart/form-data',
    };

    const res = await HttpRequest.post(
      '/api/media/uploadServer',
      formData,
      header
    );
    const filesData = res.data.files;
    const mediaData = [];
    for (let i = 0; i < filesData.length; i++) {
      const file = filesData[i];
      mediaData.push({
        postId: postId,
        filename: file.filename,
        filePath: file.path,
        mimeType: file.mimetype,
        originalName: file.originalname,
        size: 6749075,
      });
    }

    return HttpRequest.post('/api/media/uploadDB', mediaData);
  },
};
