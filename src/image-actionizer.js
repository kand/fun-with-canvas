var canvas = document.getElementById('dotCanvas');
var $canvas = $(canvas);
var context = canvas.getContext('2d');

var dotsApp = angular.module('dotsApp', []);

var getCursorPosition = function($event) {
  var x;
  var y;
  var canoffset = $canvas.offset();

  return {
    x: $event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left),
    y: $event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1
  };
};

dotsApp.controller('DotsController', function ($scope) {
  $scope.drawingModes = {
    DOTS: 'dots',
    FREE: 'free'
  };

  $scope.drawMode = $scope.drawingModes.DOTS;

  $scope.inPath = -1;
  $scope.drawingLine = false;
  $scope.paths = [];
  var currPath;
  $scope.startFreeDraw = function ($event) {
    if ($scope.drawMode === $scope.drawingModes.FREE) {
      var pos = getCursorPosition($event);
      currPath = new Path2D();
      currPath.moveTo(pos.x, pos.y);
      $scope.drawingLine = true;
    }
  };
  $scope.doFreeDraw = function ($event) {
    var pos = getCursorPosition($event);
    $scope.inPath = -1;
    for (var i = 0; i < $scope.paths.length; i++) {
      if (context.isPointInPath($scope.paths[i], pos.x, pos.y)) {
        $scope.inPath = i;
      }
    }

    if ($scope.drawMode === $scope.drawingModes.FREE && $scope.drawingLine) {
      currPath.lineTo(pos.x, pos.y);
      context.stroke(currPath);
    }
  };
  $scope.stopFreeDraw = function ($event) {
    if ($scope.drawMode === $scope.drawingModes.FREE && $scope.drawingLine) {
      currPath.closePath();
      context.fillStyle = 'rgba(255, 0, 0, 0.5)';
      context.fill(currPath);
      context.stroke(currPath);
      $scope.drawingLine = false;
      $scope.paths.push(currPath);
    }
  };

  $scope.dots = [];
  $scope.drawDot = function ($event) {
    if ($scope.drawMode === $scope.drawingModes.DOTS) {
      var pos = getCursorPosition($event);
      var r = 2;

      context.beginPath();
      context.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
      context.fillStyle = '#000';
      context.fill();
      context.stroke();

      $scope.dots.push({x: pos.x, y: pos.y});
    }
  };

  $scope.clearCanvas = function () {
    $scope.dots = [];
    $scope.paths = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
  };
});
