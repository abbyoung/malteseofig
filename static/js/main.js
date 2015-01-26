window.onload = function(){

  var $jsonp = (function(){
    var that = {};

    that.send = function(src, options) {
      var callback_name = options.callbackName || 'callback',
        on_success = options.onSuccess || function(){},
        on_timeout = options.onTimeout || function(){},
        timeout = options.timeout || 10; // sec

      var timeout_trigger = window.setTimeout(function(){
        window[callback_name] = function(){};
        on_timeout();
      }, timeout * 1000);

      window[callback_name] = function(data){
        window.clearTimeout(timeout_trigger);
        on_success(data);
      }

      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = src;

      document.getElementsByTagName('head')[0].appendChild(script);
    }

    return that;
  })();

  $jsonp.send('https://api.instagram.com/v1/tags/dogsofig/media/recent?access_token=1747418.b565f8e.92d6a97839ce4f6bb7caaca590b0487a&count=20&callback=handleStuff', {
    callbackName: 'handleStuff',
    onSuccess: function(json){
        console.log('success!', json);
        addPictures(json);
    },
    onTimeout: function(){
        console.log('timeout!');
    },
    timeout: 5
  });
  
  function addPictures(json) {
    // get containers for photos
    var photos = document.getElementsByTagName('img'); 
    for (var i=0; i<20; i++) {
      photos[i].src = json.data[i].images.thumbnail.url;
      addClick(photos[i]);
    }

  };

  function addClick(photo) {
    photo.addEventListener("click", function(){
      console.log('photo been clicked');
    });
  }




}