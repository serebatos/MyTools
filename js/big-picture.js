import {checkIsEscapeKey, checkIsMouseClick, toggleClass} from './utils.js';

const COMMENTS_SHOWEN = 5;

// Выбираем нужные элементы для заполнения данными
const bigPicElement = document.querySelector('.big-picture');
const bigPicCloseButtonElement = bigPicElement.querySelector('.big-picture__cancel');
const bigPicImgElement = bigPicElement.querySelector('.big-picture__img img');
const bigPicLikesCountElement = bigPicElement.querySelector('.likes-count');
const bigPicCommentsCountStartElement = bigPicElement.querySelector('.comments-count-start');
const bigPicCommentsCountElement = bigPicElement.querySelector('.comments-count');
const bigPicCaptionElement = bigPicElement.querySelector('.social__caption');
const bigPicCommentsElement = bigPicElement.querySelector('.social__comments');
const bigPicCommentsLoaderElement = bigPicElement.querySelector('.social__comments-loader');

let shownCommentsCount = 0;
let totalCommentLists = [];
let totalCommentListLength = 0;

const fillBigPicComments = (comments) => {
  bigPicCommentsElement.innerHTML = '';

  //Генерим из массива комментариев HTML текс с данными из массива. Применяем метод reduce для конкатинации всех элементов.
  //, '' - задаем первый эелемент reduce, чтобы аккумулировать все эелементы массива с самого начала.
  const commentsList = comments.reduce((accumulator, currentComment) => {
    shownCommentsCount++;
    accumulator += `<li class="social__comment ${shownCommentsCount > COMMENTS_SHOWEN ? 'hidden' : ''}">
      <img class="social__picture" src="${currentComment.avatar}" alt="${currentComment.name}" width="35" height="35">
      <p class="social__text">${currentComment.message}</p>
    </li>`;
    return accumulator;
  }, '');

  //Добавляем полученный список элементов в список комментариев большой картинки.
  bigPicCommentsElement.insertAdjacentHTML('beforeend', commentsList);
};

//Функция после каждого телодвижения заполняет в HTML даныне по количеству отображаемых комментариев и убирает кнопку если уже показали все комментарии.
const fillCommentsCount = () => {
  bigPicCommentsCountStartElement.textContent = shownCommentsCount;
  bigPicCommentsCountElement.textContent = totalCommentListLength;
  if(shownCommentsCount === totalCommentListLength) {
    bigPicCommentsLoaderElement.classList.add('hidden');
  }
};

const renderBigPic = ({url, likes, description, comments}) => {
  //заполняем данным из объекта элементы DOM
  bigPicImgElement.src = url;
  bigPicLikesCountElement.textContent = likes;
  bigPicCommentsCountElement.textContent = comments.length;
  bigPicCaptionElement.textContent = description;


  //Заполняем блок комментариев из массива, инициализируем счетчик комментариев и вызываем функцию заполнения каунтов комментариев.
  fillBigPicComments(comments);
  shownCommentsCount = totalCommentListLength < COMMENTS_SHOWEN ? totalCommentListLength : COMMENTS_SHOWEN;
  fillCommentsCount();
};

//Функция запускается по нажатю на кнопку "Загрузить еще" по событию. Собирает все скерытые комментарии и удаляет класс hidden у 5 штук, или остатки (если остаток меньше 5).
const loadMoreComments = () => {
  const bigPicComments = bigPicCommentsElement.querySelectorAll('.social__comment.hidden');
  const commentsForShowCount = bigPicComments.length < COMMENTS_SHOWEN ? bigPicComments.length : COMMENTS_SHOWEN;
  shownCommentsCount += commentsForShowCount;
  for (let i=0; i < commentsForShowCount; i++) {
    bigPicComments[i].classList.remove('hidden');
  }
  fillCommentsCount();
};

//Переключаем открытие и закрытие окна
const tooglePictureModal = (isHidden) => {
  toggleClass(bigPicElement, 'hidden', !isHidden);
  toggleClass(document.body, 'modal-open', isHidden);
};

const closeBigPicModal = () => {
  shownCommentsCount = 0;
  bigPicCommentsLoaderElement.classList.remove('hidden');
  bigPicCommentsElement.innerHTML = '';

  tooglePictureModal(false);
  document.removeEventListener('keydown', onDocumentEscKeydown);
  bigPicCloseButtonElement.removeEventListener('click', onCloseButtonClick);
  bigPicCommentsLoaderElement.removeEventListener('click', onCommentsLoaderClick);
};

//Все действия, которые нужно сделать при открытии модального окна
const openBigPicModal = (element) => {
  totalCommentLists = element.comments;
  totalCommentListLength = totalCommentLists.length;
  renderBigPic(element);
  tooglePictureModal(true);

  document.addEventListener('keydown', onDocumentEscKeydown);
  bigPicCloseButtonElement.addEventListener('click', onCloseButtonClick);
  bigPicCommentsLoaderElement.addEventListener('click', onCommentsLoaderClick);
};

function onCommentsLoaderClick (evt) {
  if(checkIsMouseClick(evt)) {
    loadMoreComments();
  }
}

function onDocumentEscKeydown (evt) {
  if(checkIsEscapeKey(evt)) {
    closeBigPicModal();
  }
}

function onCloseButtonClick (evt) {
  evt.preventDefault();
  if(checkIsMouseClick(evt)) {
    closeBigPicModal();
  }
}

export {openBigPicModal};


