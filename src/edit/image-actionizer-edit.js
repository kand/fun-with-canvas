var ImageActionizerEditor = (function (
    Utils,
    $,
    Path2D,
    CustomEvent,
    FileReader,
    URL,
    SVGCanvas,
    Zipper
) {
  'use strict';

  var ImageActionizerEditor = function (imageContainer) {
    this.$imageContainer = $(imageContainer);

    this.inPath = null;
    this.drawingLine = false;

    this.setupElements();
  };

  ImageActionizerEditor.prototype.setImage = function (file) {
    if (this.image && this.image.src) {
      URL.revokeObjectURL(this.image.src);
    }

    this.rawFile = file;
    this.image.src = URL.createObjectURL(file);

    this.resizeCanvas();
  };

  ImageActionizerEditor.prototype.setupElements = function () {
    this.context = new SVGCanvas();
    this.$canvas = $(this.context.getSvg());
    this.$canvas.height(0);
    this.$canvas.width(0);

    this.$canvas.on('mousedown', this.startFreeDraw.bind(this));
    this.$canvas.on('mousemove', this.doFreeDraw.bind(this));
    this.$canvas.on('mouseup', this.stopFreeDraw.bind(this));

    this.$canvas.on('mousedown', 'path', this.startEditPathDetails.bind(this));

    this.$imageContainer.append(this.$canvas);

    this.image = document.createElement('img');
    this.image.addEventListener('load', this.resizeCanvas.bind(this));
    this.$imageContainer.append(this.image);
  };

  ImageActionizerEditor.prototype.resizeCanvas = function () {
    this.$canvas.height(this.image.height);
    this.$canvas.width(this.image.width);
  };

  ImageActionizerEditor.prototype.startFreeDraw = function (event) {
    var pos = Utils.getCursorPosition(event, this.$canvas);
    this.context.beginPath();
    this.context.moveTo(pos.x, pos.y);
    this.drawingLine = true;
  };

  ImageActionizerEditor.prototype.doFreeDraw = function (event) {
    if (this.drawingLine) {
      var pos = Utils.getCursorPosition(event, this.$canvas);
      this.context.lineTo(pos.x, pos.y);
      this.context.stroke();
    }
  };

  ImageActionizerEditor.prototype.stopFreeDraw = function (event) {
    if (this.drawingLine) {
      this.context.closePath();
      this.context.fillStyle = 'rgba(255, 0, 0, 0.5)';
      this.context.fill();
      this.context.stroke();
      this.drawingLine = false;
    }
  };

  ImageActionizerEditor.prototype.clearCanvas = function () {
    this.stopFreeDraw();
    this.stopEditPathDetails();

    this.context.save();
    this.$canvas.children('g').empty();
    this.context.restore();
  };

  ImageActionizerEditor.prototype.startEditPathDetails = function (e) {
    this.$imageContainer.trigger('ImageActionizer:Editor:StartEditPathDetails', e.target);
  };

  ImageActionizerEditor.prototype.stopEditPathDetails = function () {
    this.$imageContainer.trigger('ImageActionizer:Editor:StopEditPathDetails');
  };

  ImageActionizerEditor.prototype.save = function () {
    Utils.image.save({
      svg: this.context.getSerializedSvg(),
      imageFile: this.rawFile
    });
  };

  return ImageActionizerEditor;
})(
  ImageActionizerUtils,
  jQuery,
  Path2D,
  CustomEvent,
  FileReader,
  URL,
  C2S,
  JSZip
);
