import {create} from 'apisauce';
import {API_KEY, BASE_URL} from '../constants/constant';

// define the api
const API = create({
  baseURL: BASE_URL,
});

export const DEFAULT_MOVIES_PARAMS = {
  language: 'en-US',
  page: 1,
  api_key: API_KEY,
};

export const DEFAULT_SEARCH_PARAMS = {
  include_adult: false,
  language: 'en-US',
  page: 1,
  api_key: API_KEY,
};

export const ApiService = {
  getMovies() {
    const paramsURL = new URLSearchParams(DEFAULT_MOVIES_PARAMS).toString();
    const url = `movie/popular?${paramsURL}`;
    return API.get(url);
  },
  getMovie(movieId) {
    const url = `movie/${movieId}?api_key=${API_KEY}`;
    return API.get(url);
  },
  searchMovies(params) {
    const paramsURL = new URLSearchParams(params).toString();
    const url = `search/movie?${paramsURL}`;
    return API.get(url);
  },
};
