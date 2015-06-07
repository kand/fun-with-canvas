var ImageActionizer = (function ($, Path2D, CustomEvent) {
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

  var ImageActionizer = function (canvas) {
    this.canvas = canvas;
    this.$canvas = $(canvas);
    this.context = canvas.getContext('2d');

    this.currPath = null;
    this.inPath = null;
    this.drawingLine = false;

    this.paths = [];

    this.bindEvents();
  };

  ImageActionizer.prototype.bindEvents = function () {
    this.canvas.addEventListener('mousedown', this.startFreeDraw.bind(this));
    this.canvas.addEventListener('mousemove', this.doFreeDraw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopFreeDraw.bind(this));
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
      this.canvas.dispatchEvent(pathChangedEvent);
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
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  return ImageActionizer;
})(jQuery, Path2D, CustomEvent);
