var ImageActionizerActionized = (function (
  Utils,
  $
) {
  'use strict';

  var ImageActionizerActionized = function (imageContainer) {
    this.$imageContainer = $(imageContainer);
  };

  ImageActionizerActionized.prototype.load = function (file) {
    var self = this;
    Utils.image.load({
      file: file,
      success: function (data) {
        var image = document.createElement('img');
        image.src = data.image;
        self.$imageContainer.append(image);

        self.$imageContainer.append(data.svg);
      }
    });
  };

  return ImageActionizerActionized;
})(
  ImageActionizerUtils,
  jQuery
);
