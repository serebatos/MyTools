import {checkIsEscapeKey, checkIsMouseClick, toggleClass, stopEscPropagation} from './utils.js';
import {onScaleButtonClick} from './picture-scale.js';
import {createSlider, removeSlider} from './picture-effect.js';
import  './validate.js';
import  {pristine, onSubmitButtonClick} from './validate.js';

const PICTURE_TYPES = ['jpeg', 'png', 'gif', 'jpg'];

//Определяем необходимые элементы
const pictureUploadFormElement = document.querySelector('.img-upload__form');
const pictureUploadButtonElement = pictureUploadFormElement.querySelector('.img-upload__start input[type=file]');
const pictureUploadModalElement = pictureUploadFormElement.querySelector('.img-upload__overlay');
const pictureUploadCloseButtonElement = pictureUploadFormElement.querySelector('#upload-cancel');
const pictureUploadPreviewElement = pictureUploadFormElement.querySelector('.img-upload__preview img');
const scaleControlValueElement = document.querySelector('.scale__control--value');
const pictureUploadHashtagsElement = pictureUploadFormElement.querySelector('.text__hashtags');
const pictureUploadDescrElement = pictureUploadFormElement.querySelector('.text__description');
const scaleControlsElement = document.querySelectorAll('[type=\'button\'].scale__control');

const uploadPhoto = (evt) => {
  const file = evt.target.files[0];
  const fileName = file.name;
  if (PICTURE_TYPES.some((format) => fileName.endsWith(format))) {
    pictureUploadPreviewElement.src = URL.createObjectURL(file);
  }
};

const onHashtagsAnyKeydown = stopEscPropagation;
const onDescrAnyKeydown = stopEscPropagation;

const tooglePictureUploadModal = (isHidden) => {
  toggleClass(pictureUploadModalElement, 'hidden', !isHidden);
  toggleClass(document.body, 'modal-open', isHidden);
};

const closePictureUploadModal = () => {
  pictureUploadFormElement.reset();
  pictureUploadButtonElement.value = '';
  pictureUploadPreviewElement.style = '';
  if (pictureUploadPreviewElement.className) {
    pictureUploadPreviewElement.classList.remove(pictureUploadPreviewElement.className);
  }
  pristine.reset();
  removeSlider();

  tooglePictureUploadModal(false);
  document.removeEventListener('keydown', onDocumentEscKeydown);
  pictureUploadCloseButtonElement.removeEventListener('click', onCloseButtonClick);
  pictureUploadFormElement.removeEventListener('submit', onSubmitButtonClick);
  pictureUploadHashtagsElement.removeEventListener('keydown', onHashtagsAnyKeydown);
  pictureUploadDescrElement.removeEventListener('keydown', onDescrAnyKeydown);
  scaleControlsElement.forEach((element) => {
    element.removeEventListener('click', onScaleButtonClick);
  });
};

const openPictureUploadModal = (evt) => {
  uploadPhoto(evt);
  scaleControlValueElement.value = '100%';
  pictureUploadPreviewElement.style.transform = 'scale(1)';
  createSlider();

  tooglePictureUploadModal(true);
  document.addEventListener('keydown', onDocumentEscKeydown);
  pictureUploadCloseButtonElement.addEventListener('click', onCloseButtonClick);
  pictureUploadFormElement.addEventListener('submit', onSubmitButtonClick);
  pictureUploadHashtagsElement.addEventListener('keydown', onHashtagsAnyKeydown);
  pictureUploadDescrElement.addEventListener('keydown', onDescrAnyKeydown);
  scaleControlsElement.forEach((element) => {
    element.addEventListener('click', onScaleButtonClick);
  });
};

function onDocumentEscKeydown (evt) {
  if(checkIsEscapeKey(evt)) {
    closePictureUploadModal();
  }
}

function onCloseButtonClick (evt) {
  if(checkIsMouseClick(evt)) {
    closePictureUploadModal();
  }
}

pictureUploadButtonElement.addEventListener('change', openPictureUploadModal);

export {closePictureUploadModal};

