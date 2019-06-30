'use strict';

window.data = (function () {
  var ADS_COUNT = 8;
  var IMG_NAME_LIMITER = 9;
  var AVATAR_PATH = 'img/avatars/user';

  var offerTypes = ['palace', 'flat', 'house', 'bungalo'];
  var pinSizes = {
    width: 50,
    height: 70
  };

  var MapLimit = {
    X_MIN: 0,
    X_MAX: 1200,
    Y_MIN: 130,
    Y_MAX: 630
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
            x: getRandomCoordinate(MapLimit.X_MIN + (pinSizes.width / 2), MapLimit.X_MAX - (pinSizes.width / 2)),
            y: getRandomCoordinate(MapLimit.Y_MIN, MapLimit.Y_MAX - pinSizes.height)
          }
        };

        generatedAds.push(ad);
      }

      return generatedAds;
    }
  };
}());
