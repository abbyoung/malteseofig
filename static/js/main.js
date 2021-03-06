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


Gallery = function(json) {
  var self = this;

  self.gallery = document.getElementById('gallery');
  self.overlay = document.getElementById('overlay');
  self.fullSize = document.getElementById('fullSize');
  self.prev = document.getElementById('prev');
  self.next = document.getElementById('next');
  self.overlayBackground = document.getElementById('overlayBackground');
  self.caption = document.getElementById('caption');
  self.json = json;

  self.overlayBackground.onclick = function(){
    self.close();

  };

  // close button
  document.getElementById('close').onclick = function(e){
    e.preventDefault();
    self.close();
  };

  for (var i=0; i<json.data.length; i++) {
    var li = document.createElement('li');
    var img = document.createElement('img');
    self.gallery.appendChild(li);
    li.appendChild(img);
    img.height = self.json.data[i].images.thumbnail.height;
    img.width = self.json.data[i].images.thumbnail.width;

    // // set img src to thumbnail
    img.src = self.json.data[i].images.thumbnail.url;
    console.log(self.json.data[i].caption.from.username);
    console.log(self.json.data[i].caption.text);
    // // console.log(json.data[i].likes.count)
    (function(index) {
      li.onclick = function(){
        self.open(index);
      };
    })(i);

  }

};

Gallery.prototype.close = function() {
  var self = this;

  self.overlay.style.display = 'none';
  self.overlayBackground.style.display = 'none';
  document.body.className = '';

}

Gallery.prototype.open = function(index) {
  var self = this;

  self.overlay.className = 'open-photo';
  document.body.className = 'noscroll';

  
  self.prev.onclick = function(e){
    e.preventDefault();
    if (index > 0) {
     self.open(index-1);
   }

  };

  self.next.onclick = function(e){
    e.preventDefault();
    if (index < self.json.data.length-1) {
      self.open(index+1);
    }
  };

  // for edge case styles

  // hide prev if at the beginning of the gallery
  if (index <= 0) {
    self.prev.style.display = 'none';
  }
  else {
    self.prev.style.display = 'inline-block';
  }

  // hide next if at the end of the gallery
  if (index >= self.json.data.length-1) {
    self.next.style.display = 'none';
  }
  else {
    self.next.style.display = 'inline-block';
  }

  // show standard size photo in gallery
  var preload = new Image();
  preload.src = self.json.data[index].images.standard_resolution.url;
  if (!preload.complete) {
    self.fullSize.style.visibility = 'hidden';
    preload.onload = function(){
      self.fullSize.src = preload.src;
      self.fullSize.style.visibility = 'visible';
    };    
  } else {
      self.fullSize.src = preload.src;    
  }
  self.caption.innerHTML = '<a href="http://instagram.com/'+self.json.data[index].caption.from.username+'" target="_blank">' + '@'+self.json.data[index].caption.from.username + '</a><br/>' + self.json.data[index].caption.text;
  self.overlay.style.display = 'block';
  self.overlayBackground.style.display='block';
};

window.onload = function(){

  $jsonp.send('https://api.instagram.com/v1/tags/maltese/media/recent?client_id=b565f8e7b5f6473b8aca80b5c9d5de9c&count=20&callback=handleStuff', {
    callbackName: 'handleStuff',
    onSuccess: function(json){
        console.log('success!', json);
        new Gallery(json);
    },
    onTimeout: function(){
        alert('Whoops! Try again, plz.')
    },
    timeout: 5
  });
};