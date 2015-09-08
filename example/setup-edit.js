;(function (
  $,
  ImageActionizerEditor
) {
  $(document).ready(function () {
    var $container = $('#imageContainer');
    var $pathDetailsForm = $('#pathDetailsForm');
    var imageActionizer = new ImageActionizerEditor($container);

    var clearPathDetailsForm = function () {
      $pathDetailsForm.hide();
      $pathDetailsForm[0].reset();
    };

    $('#clearBtn').on('click', function () {
      imageActionizer.clearCanvas();
    });

    $('#saveBtn').on('click', function () {
      imageActionizer.save();
    });

    $('#imageSetter').on('change', function () {
      imageActionizer.setImage(this.files[0]);
    });

    $('#imageLoader').on('change', function () {
      imageActionizer.load(this.files[0]);
    });

    $pathDetailsForm.submit(function (e) {
      e.preventDefault();

      var $this = $(this);
      var path = $this.data('path');
      if (path) {
        var formData = $this.serializeArray().reduce(function (retObj, point) {
          retObj[point.name] = point.value;
          return retObj;
        }, {});
        if (formData.pathDetailsId) {
          $(path).attr('id', formData.pathDetailsId);
        }
      }

      clearPathDetailsForm();
    });

    $container
      .on('ImageActionizer:Editor:StartEditPathDetails', function (e, path) {
        $pathDetailsForm.data('path', path);
        $pathDetailsForm.show();
      })
      .on('ImageActionizer:Editor:StopEditPathDetails', clearPathDetailsForm);
  });
})(
  jQuery,
  ImageActionizerEditor
);
