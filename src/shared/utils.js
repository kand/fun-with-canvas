var ImageActionizerUtils = (function (
  Blob,
  $,
  Zipper,
  FileReader,
  saveAs,
  URL
) {

  return {
    getCursorPosition: function ($event, $canvas) {
      var x;
      var y;
      var canoffset = $canvas.offset();

      return {
        x: event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left),
        y: event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1
      };
    },

    image: {
      save: function (optionsIn) {
        if (!optionsIn.svg) {
          throw new Error('SVG missing from file data to save.');
        }

        if (!optionsIn.imageFile) {
          throw new Error('Image missing from file data to save.');
        }

        var options = $.extend({
          fileName: 'image.actionized'
        }, optionsIn);

        var reader = new FileReader();

        reader.onloadend = function () {
          var zip = new Zipper();
          zip.file('regions', options.svg);
          zip.file('image', reader.result, {binary: true});

          var content = zip.generate({type: 'blob'});

          saveAs(content, 'image.actionized');
        };

        reader.readAsBinaryString(options.imageFile);
      },
      load: function (optionsIn) {
        if (!optionsIn.file) {
          throw new Error('Must provide a file to load.');
        }

        var options = $.extend({
          success: function () {}
        }, optionsIn);

        var reader = new FileReader();

        reader.onloadend = function () {
          var zip = new Zipper(reader.result);

          var imageBlob = new Blob([zip.files.image.asArrayBuffer()]);

          options.success({
            svg: $(zip.files.regions.asText()),
            image: URL.createObjectURL(imageBlob)
          });
        };

        reader.readAsBinaryString(options.file);
      }
    }
  };

})(
  Blob,
  jQuery,
  JSZip,
  FileReader,
  saveAs,
  URL
);
