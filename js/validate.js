import {closePictureUploadModal} from './picture-upload.js';
import {createPostLoader} from  './data-loader.js';
import {openValidModal} from  './post-validate.js';
import {checkIsFormSubmit} from './utils.js';

//Объявлем переменные
const HASHTAGS_MAX_COUNT = 5;
const HASHTAGS_MIN_SYMBOLS = 2;
const HASHTAGS_MAX_SYMBOLS = 20;
const HASHTAGS_REGEX = /^#[A-Za-zА-Яа-яЕё0-9]{1,19}$/;
const DESCRIPTION_MAX_LENGTH = 140;
const URL_POST = 'https://25.javascript.pages.academy/kekstagram';

//Выбираем форму, а в ней поле ввода хештегов и описания
const pictureUploadFormElement = document.querySelector('.img-upload__form');
const pictureUploadHashtagsElement = pictureUploadFormElement.querySelector('.text__hashtags');
const pictureUploadDescrElement = pictureUploadFormElement.querySelector('.text__description');
const pictureUploadSubmitBtnElement = pictureUploadFormElement.querySelector('.img-upload__submit');

//Разбиваем массив на отдельные элементы
const splitHashtags = ((HashtagsString) =>
  HashtagsString.trim().toLowerCase().split(' ').filter((element) => element !== '')
);

///Проверка, не состоит ли хэштег только из символа решетки (#).
const isValidTagOnlyHash = ((value) =>
  !(splitHashtags(value).some((element) => (element.charAt(0) === '#' && element.length === 1)))
);

//Проверка, начинается ли хэштег с символа решетки (#).
const isValidTagFromHash = ((value) =>
  splitHashtags(value).every((element) => element.startsWith('#'))
);

// Проверка на превышение количества хэштегов..
const isValidTagsOverflow = ((value) =>
  splitHashtags(value).length <= HASHTAGS_MAX_COUNT
);

// Проверка на наличие повторяющихся хэштегов.
const isValidTagsDublicate = ((value) =>
  !(splitHashtags(value).some((element, index, arr) => arr.lastIndexOf(element) !== index))
);

// Проверка на минимальную и максимальную длину хэштега.
const isValidTagsLengthMinMax = ((value) =>
  splitHashtags(value).every((element) => element.length >= HASHTAGS_MIN_SYMBOLS && element.length <= HASHTAGS_MAX_SYMBOLS)
);

// Проверка хэштегов на соответствие регулярному выражению.
const isValidTagsRegExp = ((value) =>
  splitHashtags(value).every((element) => element.match(HASHTAGS_REGEX))
);
// Проверка описания на длину текста.
const isValidDescrLength = ((value) =>
  value.length <= DESCRIPTION_MAX_LENGTH
);

//Создаем единую функцию для валидации хещтега
const validateHash = (value) => {
  const errorMessages = [];
  if(!isValidTagOnlyHash(value)) {
    errorMessages.push('ХешТег не должен состоять только из #.');
  }

  if(!isValidTagFromHash(value)) {
    errorMessages.push('ХешТег должен состоять из # и хотя бы одного символа.');
  }

  if(!isValidTagsOverflow(value)) {
    errorMessages.push(`Максимальное кол-во хештегов ${HASHTAGS_MAX_COUNT} штук.`);
  }

  if(!isValidTagsDublicate(value)) {
    errorMessages.push('Все хештеги должны быть уникальными.');
  }

  if(!isValidTagsLengthMinMax(value)) {
    errorMessages.push(`Длина хештега должна быть больше ${HASHTAGS_MIN_SYMBOLS} и меньше ${HASHTAGS_MAX_SYMBOLS} символов.`);
  }

  if(!isValidTagsRegExp(value)) {
    errorMessages.push('Хештег должен состоять только из букв и цифр');
  }

  return errorMessages;
};

//Создаем объект Pristine при помощи библиотеки и описываем как должен добавляться класс с ошибками.
const pristine = new Pristine(pictureUploadFormElement, {
  classTo: 'text__label',
  errorClass: 'text__label--invalid',
  successClass: 'text__label--valid',
  errorTextParent: 'text__label',
  errorTextTag: 'div',
  errorTextClass: 'text__error'
});

//Вешаем слушателей методом addValidator на поле Хеш и Описание.
pristine.addValidator(pictureUploadHashtagsElement, (value) => (validateHash(value).length===0), (value) => (validateHash(value)[0]));
pristine.addValidator(pictureUploadDescrElement, isValidDescrLength, `Длина описания не должна превышать ${DESCRIPTION_MAX_LENGTH} символов`);

//Проверяем что все поля валидны пере отправкой формы.

const lockSubmitButton = (element) => {
  element.disabled = true;
  element.textContent = 'Загружаю...';
};
const unlockSubmitButton = (element) => {
  element.disabled = false;
  element.textContent = 'Опубликовать';
};

const onSubmitButtonClick = (evt) => {
  if(checkIsFormSubmit(evt)) {
    evt.preventDefault();

    if(pristine.validate()) {
      lockSubmitButton(pictureUploadSubmitBtnElement);
      createPostLoader(
        URL_POST,
        () => {
          closePictureUploadModal(evt);
          unlockSubmitButton(pictureUploadSubmitBtnElement);
          openValidModal('success');
        },
        () => {
          closePictureUploadModal(evt);
          unlockSubmitButton(pictureUploadSubmitBtnElement);
          openValidModal('error');
        },
        new FormData(evt.target)
      );
    }
  }
};

//Экспортируем объект для обнуления при открытии окна формы.
export {pristine, onSubmitButtonClick};
