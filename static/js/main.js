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
    // adding thumbnails
      var thumbnails = document.getElementsByTagName('img'); 
      var gallery = document.getElementById('gallery');
      var overlay = document.getElementById('overlay');
      var fullSize = document.getElementById('fullSize');
      var prev = document.getElementById('prev');
      var next = document.getElementById('next');
      var close = document.getElementById('close');
      var overlayBackground = document.getElementById('overlayBackground');

      overlayBackground.onclick = function(){
        overlay.style.display = 'none';
        overlayBackground.style.display = 'none';

      };



      for (var i=0; i<json.data.length; i++) {
        var li = document.createElement('li');
        var img = document.createElement('img');
        gallery.appendChild(li);
        li.appendChild(img);

        // // set img src to thumbnail
        img.src = json.data[i].images.thumbnail.url;
        // // console.log(json.data[i].caption.from.username);
        // // console.log(json.data[i].likes.count)
        (function(index) {
          li.addEventListener("click", function(){
            openGallery(index);
          });
        })(i);

      }

      function openGallery(index) {
        prev.onclick = function(e){
          e.preventDefault();
          if (index > 0) {
           openGallery(index-1);
         }

        };

        next.onclick = function(e){
          e.preventDefault();
          if (index < json.data.length-1) {
            openGallery(index+1);
          }
        };

        // for edge case styles

        // hide prev if at the beginning of the gallery
        if (index <= 0) {
          prev.style.display = 'none';
        }
        else {
          prev.style.display = 'inline-block';
        }

        // hide next if at the end of the gallery
        if (index >= json.data.length-1) {
          next.style.display = 'none';
        }
        else {
          next.style.display = 'inline-block';
        }

        // show standard size photo in gallery
        fullSize.src = json.data[index].images.standard_resolution.url;
        overlay.style.display = 'block';
        overlayBackground.style.display='block';

        // close button
        close.onclick = function(e){
          e.preventDefault();
          overlay.style.display = 'none';
          overlayBackground.style.display='none';
        }

      }


  };





}