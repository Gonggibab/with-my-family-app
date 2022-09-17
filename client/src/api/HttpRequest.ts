import axios from 'axios';

const HttpRequest = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export default HttpRequest;
