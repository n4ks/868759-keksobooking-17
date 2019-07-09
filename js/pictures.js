'use strict';

window.pictures = (function () {
  var PHOTO_CLASS = 'ad-photo';
  // var AVATAR_DROP_CLASS = ''
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var DRAG_OVER_STYLE = {
    ADD: '2px dashed tomato',
    REMOVE: 'none'
  };
  var DROPDOWN_STYLE = {
    ADD: 'tomato',
    REMOVE: '#c7c7c7'
  };

  var form = document.querySelector('.ad-form');
  var avatar = form.querySelector('.ad-form-header__preview img');
  var avatarUpload = form.querySelector('#avatar');
  var avatarUploadDropZone = form.querySelector('.ad-form-header__drop-zone');
  var photosContainer = form.querySelector('.ad-form__photo-container');
  var photosUpload = form.querySelector('#images');
  var photosDropZone = form.querySelector('.ad-form__drop-zone');
  var photoFrame = form.querySelector('.ad-form__photo');

  var uploadPicture = function (file, pictureTemplate) {
    if (file !== null) {
      var fileName = file.name.toLowerCase();

      var checkFIleFormat = FILE_TYPES.some(function (format) {
        return fileName.endsWith(format);
      });

      if (checkFIleFormat) {
        var fileReader = new FileReader();

        var onFileLoad = function () {
          pictureTemplate.src = fileReader.result;
          fileReader.removeEventListener('load', onFileLoad);
        };

        fileReader.addEventListener('load', onFileLoad);

        fileReader.readAsDataURL(file);
      }
    }
  };

  var uploadOnClick = function (fileSource, template) {
    var file = fileSource.files[0];
    uploadPicture(file, template);
  };

  var uploadOnDrop = function (fileSource, template) {
    var file = fileSource.dataTransfer.items[0].getAsFile();
    uploadPicture(file, template);
  };

  // Переносим стили с дива на фотографии (переделать, переносит какую то дичь)
  var copyNodeStyle = function (sourceNode, targetNode) {
    var computedStyle = window.getComputedStyle(sourceNode);
    Array.from(computedStyle).forEach(function (key) {
      return targetNode.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key));
    });
  };

  // Загрузка фото
  var createImg = function () {
    var img = document.createElement('img');
    img.setAttribute('draggable', true);
    img.classList.add(PHOTO_CLASS);
    copyNodeStyle(photoFrame, img);

    return img;
  };

  var onPhotoChange = function () {
    var img = createImg();
    uploadOnClick(photosUpload, img);
    photosContainer.appendChild(img);
  };

  // Загрузка аватара через drag and drop
  avatarUploadDropZone.addEventListener('dragover', function (evt) {
    evt.target.style.borderColor = DROPDOWN_STYLE.ADD;
    evt.preventDefault();
  });

  avatarUploadDropZone.addEventListener('dragleave', function (evt) {
    evt.target.style.borderColor = DROPDOWN_STYLE.REMOVE;
  });

  avatarUploadDropZone.addEventListener('drop', function (evt) {
    evt.preventDefault();
    uploadOnDrop(evt, avatar);
    evt.target.style.borderColor = DROPDOWN_STYLE.REMOVE;
  });

  // Загрузка фото через drag and drop
  photosDropZone.addEventListener('dragover', function (evt) {
    evt.target.style.borderColor = DROPDOWN_STYLE.ADD;
    evt.preventDefault();
  });

  photosDropZone.addEventListener('dragleave', function (evt) {
    evt.target.style.borderColor = DROPDOWN_STYLE.REMOVE;
  });

  photosDropZone.addEventListener('drop', function (evt) {
    evt.preventDefault();
    var img = createImg();
    uploadOnDrop(evt, img);
    // Проверяем чтобы на входе был файл, а не что то другое
    if (evt.dataTransfer.items[0].getAsFile()) {
      photosContainer.appendChild(img);
    }
    evt.target.style.borderColor = DROPDOWN_STYLE.REMOVE;
  });

  // Сортировка фото

  // Получаем индексы элементов внутри родительского элемента
  var getChildIndex = function (node) {
    return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
  };
  var draggableItemIndex;
  var draggableItemTargetIndex;
  var photosPermutation = function () {
    var draggableItem;

    photosContainer.addEventListener('dragstart', function (evt) {
      if (evt.target.hasAttribute('draggable')) {
        draggableItem = evt.target;
        draggableItemIndex = getChildIndex(draggableItem);
      }
    });

    photosContainer.addEventListener('dragenter', function (evt) {
      if (evt.target.className === PHOTO_CLASS && evt.target !== draggableItem) {
        evt.target.style.border = DRAG_OVER_STYLE.ADD;
      }
    });

    photosContainer.addEventListener('dragleave', function (evt) {
      if (evt.target.className === PHOTO_CLASS && evt.target !== draggableItem) {
        evt.target.style.border = DRAG_OVER_STYLE.REMOVE;
      }
    });

    photosContainer.addEventListener('dragover', function (evt) {
      evt.preventDefault();
    }, false);

    photosContainer.addEventListener('drop', function (evt) {
      if (evt.target.className === PHOTO_CLASS) {
        evt.preventDefault();
        draggableItemTargetIndex = getChildIndex(evt.target);

        if (evt.target !== draggableItem) {
          draggableItem.parentNode.removeChild(draggableItem);
          // Если перемещаемый элемент распологался до элемента с которым производится свап
          // вставляем его после и делаем обратное если он распологался после.
          if (draggableItemIndex > draggableItemTargetIndex) {
            photosContainer.insertBefore(draggableItem, evt.target);
          } else {
            photosContainer.insertBefore(draggableItem, evt.target.nextSibling);
          }
        }
        evt.target.style.border = DRAG_OVER_STYLE.REMOVE;
      }
    });
  };

  // Загрузка аватара
  var onAvatarChange = function () {
    uploadOnClick(avatarUpload, avatar);
  };
  return {
    setPicturesEvents: function () {
      avatarUpload.addEventListener('change', onAvatarChange);
      photosUpload.addEventListener('change', onPhotoChange);
      photosPermutation();
    }
  };
}());
