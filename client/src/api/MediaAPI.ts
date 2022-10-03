import HttpRequest from 'api/HttpRequest';
import { AxiosRequestHeaders } from 'axios';

export const MediaAPI = {
  uploadMedia: async (files: File[], postId: string) => {
    const formData = new FormData();
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
  uploadMediaForProfile: async (file: File, userId: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const header: AxiosRequestHeaders = {
      'content-type': 'multipart/form-data',
    };
    const res = await HttpRequest.post(
      '/api/media/uploadServer',
      formData,
      header
    );

    const fileData = res.data.files[0];
    const mediaData = [];
    mediaData.push({
      userId: userId,
      filename: fileData.filename,
      filePath: fileData.path,
      mimeType: fileData.mimetype,
      originalName: fileData.originalname,
      size: fileData.size,
    });

    return HttpRequest.post('/api/media/uploadDB', mediaData);
  },
  getByPost: (postId: string) => {
    return HttpRequest.post('/api/media/findByPost', { postId });
  },
  deleteByPost: (postId: string) => {
    return HttpRequest.post('/api/media/deleteMedia', { postId });
  },
  deleteMediabyURL: (filepaths: string[]) => {
    const urls = [];
    for (const filepath of filepaths) {
      urls.push('uploads' + filepath.split('uploads')[1]);
    }

    return HttpRequest.post('/api/media/deleteMediabyURL', { urls });
  },
};
