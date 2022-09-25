import HttpRequest from 'api/HttpRequest';
import { AxiosRequestHeaders } from 'axios';

export const MediaAPI = {
  uploadMedia: async (files: File[], postId: string) => {
    let formData = new FormData();
    for (const file of files) {
      formData.append('file', file);
    }

    const header: AxiosRequestHeaders = {
      'content-type': 'multipart/form-data',
    };
    const res = await HttpRequest.post(
      '/api/media/uploadServer',
      formData,
      header
    );

    const fileData = res.data.files;
    const mediaData = [];
    for (const file of fileData) {
      mediaData.push({
        postId: postId,
        filename: file.filename,
        filePath: file.path,
        mimeType: file.mimetype,
        originalName: file.originalname,
        size: file.size,
      });
    }

    return HttpRequest.post('/api/media/uploadDB', mediaData);
  },
  getByPost: (postId: string) => {
    return HttpRequest.post('/api/media/findByPost', { postId });
  },
};
