import {addPictures} from './pictures.js';
import {debounce} from './utils.js';

const RERENDER_DELAY = 500;

const filterElement = document.querySelector('.img-filters');
const filterFormElement = document.querySelector('.img-filters__form');
const filterFormButtonsElement = document.querySelectorAll('.img-filters__button');

const shufflePhotos = (data) => data.slice().sort(() => Math.random() - 0.5).slice(0,10);

const sortPhotosByComments = (data) => data.slice().sort((a, b) => b.comments.length - a.comments.length);

const setFilter = (data, evt) => {
  let newData = data;
  if (evt.target.id === 'filter-random') {
    newData = shufflePhotos(data);
  }
  if (evt.target.id === 'filter-discussed') {
    newData = sortPhotosByComments(data);
  }
  addPictures(newData);
};

const getDebounceCb = debounce(
  (d, e) => {
    setFilter(d, e);
  },
  RERENDER_DELAY
);

const createFilter = (data) => {
  filterElement.classList.remove('img-filters--inactive');

  filterFormElement.addEventListener('click', (evt) => {
    filterFormButtonsElement.forEach((element) => {
      if (element.id === evt.target.id) {
        element.classList.add('img-filters__button--active');
      } else {
        element.classList.remove('img-filters__button--active');
      }
    });
    getDebounceCb(data, evt);
  });
};

export {createFilter};
