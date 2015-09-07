var ImageActionizer = (function (
    $,
    Path2D,
    CustomEvent,
    FileReader,
    URL,
    SVGCanvas,
    Zipper) {
  'use strict';

  var getCursorPosition = function($event, $canvas) {
    var x;
    var y;
    var canoffset = $canvas.offset();

    return {
      x: event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left),
      y: event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1
    };
  };

  var ImageActionizer = function (imageContainer) {
    this.$imageContainer = $(imageContainer);

    this.inPath = null;
    this.drawingLine = false;

    this.setupElements();
  };

  ImageActionizer.prototype.setImage = function (file) {
    if (this.image && this.image.src) {
      URL.revokeObjectURL(this.image.src);
    }

    this.rawFile = file;
    this.image.src = URL.createObjectURL(file);

    this.resizeCanvas();
  };

  ImageActionizer.prototype.setupElements = function () {
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

  ImageActionizer.prototype.resizeCanvas = function () {
    this.$canvas.height(this.image.height);
    this.$canvas.width(this.image.width);
  };

  ImageActionizer.prototype.startFreeDraw = function (event) {
    var pos = getCursorPosition(event, this.$canvas);
    this.context.beginPath();
    this.context.moveTo(pos.x, pos.y);
    this.drawingLine = true;
  };

  ImageActionizer.prototype.doFreeDraw = function (event) {
    if (this.drawingLine) {
      var pos = getCursorPosition(event, this.$canvas);
      this.context.lineTo(pos.x, pos.y);
      this.context.stroke();
    }
  };

  ImageActionizer.prototype.stopFreeDraw = function (event) {
    if (this.drawingLine) {
      this.context.closePath();
      this.context.fillStyle = 'rgba(255, 0, 0, 0.5)';
      this.context.fill();
      this.context.stroke();
      this.drawingLine = false;
    }
  };

  ImageActionizer.prototype.clearCanvas = function () {
    this.stopFreeDraw();
    this.stopEditPathDetails();

    this.context.save();
    this.$canvas.children('g').empty();
    this.context.restore();
  };

  ImageActionizer.prototype.startEditPathDetails = function (e) {
    this.$imageContainer.trigger('ImageActionizer:StartEditPathDetails', e.target);
  };

  ImageActionizer.prototype.stopEditPathDetails = function () {
    this.$imageContainer.trigger('ImageActionizer:StopEditPathDetails');
  };

  ImageActionizer.prototype.save = function () {
    var reader = new FileReader();
    
    var self = this;
    reader.onloadend = function () {
      var zip = new Zipper();
      zip.file('regions.svg', self.context.getSerializedSvg());
      zip.file('image', reader.result, {binary: true});

      var content = zip.generate({type: 'blob'});

      saveAs(content, 'image.actionized');
    };

    reader.readAsBinaryString(this.rawFile);
  };

  return ImageActionizer;
})(jQuery, Path2D, CustomEvent, FileReader, URL, C2S, JSZip);
