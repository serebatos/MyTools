//Задаем входные параметры
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_STEP = 25;

//Выбираем необходимые элементы DOM
const scaleControlValueElement = document.querySelector('.scale__control--value');
const pictureUploadPreviewElement = document.querySelector('.img-upload__preview img');

//Для каждой кнопки из массива кнопок добавляем слушателя и считаем значение скалирования. После записываем значение в input, а в Preview добавляем стиль.

const changeScale = (evt) => {
  const element = evt.target;
  let scaleValue = parseInt(scaleControlValueElement.value, 10);
  if (scaleValue < SCALE_MAX && element.classList.contains('scale__control--bigger')) {scaleValue += SCALE_STEP;}
  if (scaleValue > SCALE_MIN && element.classList.contains('scale__control--smaller')) {scaleValue -= SCALE_STEP;}

  scaleControlValueElement.value = `${scaleValue}%`;
  pictureUploadPreviewElement.style.cssText += `transform:scale(${0.01 * scaleValue})`;
};

const onScaleButtonClick = (evt) => {
  changeScale(evt);
};

export {onScaleButtonClick};
