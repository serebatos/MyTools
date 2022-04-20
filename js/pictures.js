import {openBigPicModal} from './big-picture.js';

const addPictures = (photos) => {

  //Находим секцию с картинками, секуцию с большими картинками и все равнее добавленные картинки
  const picturesElement = document.querySelector('.pictures');
  const picturesLinkElement = picturesElement.querySelectorAll('.picture');
  //Удаляем ранее загруженные картинки
  picturesLinkElement.forEach((element) => element.remove());
  //Находим темплейт для добавления картинок
  const picturesTemplate = document.querySelector('#picture').content.querySelector('.picture');
  //Создаем фрагмен для единовременного добавления всех картинок из массива
  const fragment = document.createDocumentFragment();

  //Перебираем массив картинок, для каждого элемента создаем клон темплейта и заполняем его данными
  photos.forEach((element) => {
    //Создаем клон темплейта и выбираем елементы, в которые будем записывать данные
    const pictureTemplate = picturesTemplate.cloneNode(true);
    const pictureImgElement = pictureTemplate.querySelector('.picture__img');
    const pictureLikesElement = pictureTemplate.querySelector('.picture__likes');
    const pictureCommentsElement = pictureTemplate.querySelector('.picture__comments');

    //Записываем данные в нужные элементы
    pictureImgElement.src = element.url;
    pictureLikesElement.textContent = element.likes;
    pictureCommentsElement.textContent = element.comments.length;

    //Добавляем в элемент callback при клике, по клику будет заполнятся секция больших картинок.
    pictureTemplate.addEventListener('click', () => {
      openBigPicModal(element);
    });

    fragment.append(pictureTemplate);
  });

  picturesElement.appendChild(fragment);
};


export {addPictures};
