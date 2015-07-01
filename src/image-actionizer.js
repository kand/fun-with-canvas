var ImageActionizer = (function (
    $,
    Path2D,
    CustomEvent,
    URL,
    SVGCanvas) {
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
    this.imageContainer = imageContainer;

    this.currPath = null;
    this.inPath = null;
    this.drawingLine = false;

    this.paths = [];

    this.setupElements();
  };

  ImageActionizer.prototype.setImage = function (file) {
    this.image.src = URL.createObjectURL(file);
  };

  ImageActionizer.prototype.setupElements = function () {
    this.image = document.createElement('img');
    this.image.addEventListener('load', this.prepCanvas.bind(this));
    this.imageContainer.appendChild(this.image);
  };

  ImageActionizer.prototype.prepCanvas = function () {
    this.context = new SVGCanvas(this.image.width, this.image.height);
    this.$canvas = $(this.context.__canvas);

    this.$canvas.on('mousedown', this.startFreeDraw.bind(this));
    this.$canvas.on('mousemove', this.doFreeDraw.bind(this));
    this.$canvas.on('mouseup', this.stopFreeDraw.bind(this));

    this.imageContainer.appendChild(this.context.__canvas);
  };

  ImageActionizer.prototype.startFreeDraw = function (event) {
    var pos = getCursorPosition(event, this.$canvas);
    this.currPath = new Path2D();
    this.currPath.moveTo(pos.x, pos.y);
    this.drawingLine = true;
  };

  ImageActionizer.prototype.doFreeDraw = function (event) {
    var pos = getCursorPosition(event, this.$canvas);
    var oldPath = this.inPath;

    this.inPath = -1;
    for (var i = 0; i < this.paths.length; i++) {
      if (this.context.isPointInPath(this.paths[i], pos.x, pos.y)) {
        this.inPath = i;
      }
    }

    if (oldPath !== this.inPath) {
      // fire event to say that path has changed
      var pathChangedEvent = new CustomEvent(
        'ImageActionizer:PathChanged', {
          detail: {
            oldPath: oldPath,
            newPath: this.inPath
          }
        });
      this.imageContainer.dispatchEvent(pathChangedEvent);
    }

    if (this.drawingLine) {
      this.currPath.lineTo(pos.x, pos.y);
      this.context.stroke(this.currPath);
    }
  };

  ImageActionizer.prototype.stopFreeDraw = function (event) {
    if (this.drawingLine) {
      this.currPath.closePath();
      this.context.fillStyle = 'rgba(255, 0, 0, 0.5)';
      this.context.fill(this.currPath);
      this.context.stroke(this.currPath);
      this.drawingLine = false;
      this.paths.push(this.currPath);
    }
  };

  ImageActionizer.prototype.clearCanvas = function () {
    this.paths = [];
    this.context.clearRect(0, 0, this.context.width, this.context.height);
  };

  return ImageActionizer;
})(jQuery, Path2D, CustomEvent, URL, C2S);
