var opts = {
  lines: 13, // The number of lines to draw
  length: 1, // The length of each line
  width: 9, // The line thickness
  radius: 60, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 90, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1.5, // Rounds per second
  trail: 76, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: true, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent
  left: '50%' // Left position relative to parent
};
var target = document.getElementById('loadingScreen');
var spinner = new Spinner(opts).spin(target);
