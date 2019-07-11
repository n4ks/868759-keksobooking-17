'use strict';

window.pictures = (function () {
  var PHOTO_CLASS = 'ad-photo';
  var DEFAULT_PHOTO = 'img/muffin-grey.svg';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var PhotoFrameState = {
    ENABLED: 'block',
    DISABLED: 'none'
  };

  var DragOverState = {
    ADD: '2px dashed tomato',
    REMOVE: 'none'
  };

  var DropdownState = {
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
  var photoFrameStyles = getComputedStyle(photoFrame);
  var draggableItem;

  var uploadPicture = function (file, pictureTemplate) {
    if (file !== null) {
      var fileName = file.name.toLowerCase();

      var checkFileFormat = FILE_TYPES.some(function (format) {
        return fileName.endsWith(format);
      });

      if (checkFileFormat) {
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
  var setImgStyle = function (targetNode) {
    targetNode.style.borderRadius = photoFrameStyles.borderRadius;
    targetNode.style.marginRight = photoFrameStyles.marginRight;
    targetNode.style.marginBottom = photoFrameStyles.marginBottom;
    targetNode.style.width = photoFrameStyles.width;
    targetNode.style.height = photoFrameStyles.height;
    targetNode.style.backgroundColor = photoFrameStyles.backgroundColor;
  };

  var resetPhotoFrame = function () {
    if (getComputedStyle(photoFrame).display === PhotoFrameState.DISABLED) {
      photoFrame.style.display = PhotoFrameState.ENABLED;
    }
  };

  // Загрузка фото
  var createImg = function () {
    var img = document.createElement('img');
    img.setAttribute('draggable', true);
    img.classList.add(PHOTO_CLASS);
    setImgStyle(img);
    if (getComputedStyle(photoFrame).display === PhotoFrameState.ENABLED) {
      photoFrame.style.display = PhotoFrameState.DISABLED;
    }
    return img;
  };

  var onPhotoChange = function () {
    var img = createImg();
    uploadOnClick(photosUpload, img);
    photosContainer.appendChild(img);
  };

  // Загрузка аватара через drag and drop
  var onAvatarDragOver = function (evt) {
    evt.preventDefault();
    evt.target.style.borderColor = DropdownState.ADD;
  };

  var onAvatarDragLeave = function (evt) {
    evt.target.style.borderColor = DropdownState.REMOVE;
  };

  var onAvatarDrop = function (evt) {
    evt.preventDefault();
    uploadOnDrop(evt, avatar);
    evt.target.style.borderColor = DropdownState.REMOVE;
  };

  // Загрузка фото через drag and drop
  var onPhotosZoneDragOver = function (evt) {
    evt.preventDefault();
    evt.target.style.borderColor = DropdownState.ADD;
  };

  var onPhotosZoneDragLeave = function (evt) {
    evt.target.style.borderColor = DropdownState.REMOVE;
  };

  var onPhotosZoneDrop = function (evt) {
    evt.preventDefault();
    var img = createImg();
    uploadOnDrop(evt, img);
    // Проверяем чтобы на входе был файл, а не что то другое
    if (evt.dataTransfer.items[0].getAsFile()) {
      photosContainer.appendChild(img);
    }
    evt.target.style.borderColor = DropdownState.REMOVE;
  };

  // Сортировка фото

  // Получаем индексы элементов внутри родительского элемента
  var getChildIndex = function (node) {
    return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
  };
  var draggableItemIndex;
  var draggableItemTargetIndex;
  var onPhotoDragStart = function (evt) {
    if (evt.target.hasAttribute('draggable')) {
      draggableItem = evt.target;
      draggableItemIndex = getChildIndex(draggableItem);
    }
  };

  var onPhotoDragLeave = function (evt) {
    if (evt.target.className === PHOTO_CLASS && evt.target !== draggableItem) {
      evt.target.style.border = DragOverState.REMOVE;
    }
  };

  var onPhotoDragOver = function (evt) {
    evt.preventDefault();
  };

  var onPhotoDrop = function (evt) {
    evt.preventDefault();
    if (evt.target.className === PHOTO_CLASS) {
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
      evt.target.style.border = DragOverState.REMOVE;
    }
  };

  var onPhotoDragEnter = function (evt) {
    if (evt.target.className === PHOTO_CLASS && evt.target !== draggableItem) {
      evt.target.style.border = DragOverState.ADD;
    }
  };

  var removePhotosEvents = function () {
    avatarUploadDropZone.removeEventListener('dragover', onAvatarDragOver);
    avatarUploadDropZone.removeEventListener('dragleave', onAvatarDragLeave);
    avatarUploadDropZone.removeEventListener('drop', onAvatarDrop);

    photosDropZone.removeEventListener('dragover', onPhotosZoneDragOver);
    photosDropZone.removeEventListener('dragleave', onPhotosZoneDragLeave);
    photosDropZone.removeEventListener('drop', onPhotosZoneDrop);

    photosContainer.removeEventListener('dragenter', onPhotoDragEnter);
    photosContainer.removeEventListener('dragleave', onPhotoDragLeave);
    photosContainer.removeEventListener('dragstart', onPhotoDragStart);
    photosContainer.removeEventListener('dragover', onPhotoDragOver);
    photosContainer.removeEventListener('drop', onPhotoDrop);
    photosUpload.removeEventListener('change', onPhotoChange);
  };

  // Загрузка аватара
  var onAvatarChange = function () {
    uploadOnClick(avatarUpload, avatar);

  };
  return {
    addPicturesEvents: function () {
      avatarUpload.addEventListener('change', onAvatarChange);
      photosUpload.addEventListener('change', onPhotoChange);

      avatarUploadDropZone.addEventListener('dragover', onAvatarDragOver);
      avatarUploadDropZone.addEventListener('dragleave', onAvatarDragLeave);
      avatarUploadDropZone.addEventListener('drop', onAvatarDrop);

      photosDropZone.addEventListener('dragover', onPhotosZoneDragOver);
      photosDropZone.addEventListener('dragleave', onPhotosZoneDragLeave);
      photosDropZone.addEventListener('drop', onPhotosZoneDrop);

      photosContainer.addEventListener('dragstart', onPhotoDragStart);
      photosContainer.addEventListener('dragenter', onPhotoDragEnter);
      photosContainer.addEventListener('dragleave', onPhotoDragLeave);
      photosContainer.addEventListener('dragover', onPhotoDragOver, false);
      photosContainer.addEventListener('drop', onPhotoDrop);
    },
    resetPhotos: function () {
      resetPhotoFrame();
      avatar.src = DEFAULT_PHOTO;
      var uploadedPhotos = Array.from(photosContainer.querySelectorAll('.ad-photo'));

      uploadedPhotos.forEach(function (photo) {
        photo.remove();
      });
      removePhotosEvents();
    }
  };
}());
