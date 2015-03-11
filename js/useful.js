$(window).keydown(function(event) {
  if(event.ctrlKey && event.keyCode == 70) {
    event.preventDefault();
    console.log("Hey! Ctrl+f event captured!");

  }
  if(event.ctrlKey && event.keyCode == 83) {
    event.preventDefault();
    console.log("Hey! Ctrl+S event captured!");
  }
});
