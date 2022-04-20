import {checkIsEscapeKey, checkIsMouseClick} from './utils.js';

const closeValidModal = (evt) => {
  evt.stopPropagation();
  document.body.lastElementChild.remove();
};

const openValidModal = (type) => {
  const template = document.querySelector(`#${type}`).content.cloneNode(true);
  const mainElement = template.querySelector(`.${type}`);
  const elementInnerElement = mainElement.querySelector(`.${type}__inner`);
  const elementCloseButtonElement = mainElement.querySelector(`.${type}__button`);

  document.body.append(mainElement);

  document.addEventListener('keydown',onDocumentEscKeydown);
  elementCloseButtonElement.addEventListener('click', onCloseButtonClick);
  elementInnerElement.addEventListener('click', (evt) => {
    evt.stopPropagation();
  });
  mainElement.addEventListener('click', onMainElementClick);
};

function onDocumentEscKeydown (evt) {
  if(checkIsEscapeKey(evt)) {
    closeValidModal(evt);
  }
}

function onCloseButtonClick (evt) {
  if(checkIsMouseClick(evt)) {
    closeValidModal(evt);
  }
}

function onMainElementClick (evt) {
  if(checkIsMouseClick(evt)) {
    closeValidModal(evt);
  }
}

export {openValidModal};
