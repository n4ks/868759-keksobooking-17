'use strict';

window.data = (function () {
  var ADS_COUNT = 8;
  var IMG_NAME_LIMITER = 9;
  var AVATAR_PATH = 'img/avatars/user';
  var MAP_X_MIN = 0;
  var MAP_X_MAX = 1200;
  var MAP_Y_MIN = 130;
  var MAP_Y_MAX = 630;

  var offerTypes = ['palace', 'flat', 'house', 'bungalo'];
  var pinSizes = {
    width: 50,
    height: 70
  };

  var getRandomCoordinate = function (min, max) {
    return parseInt((Math.random() * (max - min) + min).toFixed(), 10);
  };

  return {
    generateAds: function () {
      var generatedAds = [];
      for (var i = 0; i < ADS_COUNT; i++) {
        var ad = {
          author: {
            avatar: AVATAR_PATH + (i < IMG_NAME_LIMITER ? '0' + (i + 1) : i + 1) + '.png'
          },
          offer: {
            type: offerTypes[window.util.getRandomArrayElement(offerTypes.length)]
          },
          location: {
            x: getRandomCoordinate(MAP_X_MIN + (pinSizes.width / 2), MAP_X_MAX - (pinSizes.width / 2)),
            y: getRandomCoordinate(MAP_Y_MIN + pinSizes.height, MAP_Y_MAX - pinSizes.height)
          }
        };

        generatedAds.push(ad);
      }

      return generatedAds;
    }
  };
}());
