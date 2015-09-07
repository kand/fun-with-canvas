;(function (
  $,
  ImageActionizerActionized
) {
    $(document).ready(function () {
      var $container = $('#actionizedImageContainer');
      var imageActionizer = new ImageActionizerActionized($container);

      $('#actionizedImageLoader').on('change', function () {
        imageActionizer.load(this.files[0]);
      });
    });
})(
  jQuery,
  ImageActionizerActionized
);
