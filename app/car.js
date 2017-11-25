var $ = require("jquery");

function getPlaylists(radioId) {
  console.log("Muhis muhis mmm");
  var playlists = {
    "1": "Release Radar",
    "2": "Discover Weekly",
  };

    console.log(playlists["1"]);
    console.log(playlists["2"]);


  $.ajax({
    url: 'https://api.spotify.com/v1/users/kuznetsova.vv/playlists',
    type: 'GET',
    dataType: 'json',
    success: function (data) {

      //var obj = JSON.parse(data);
      console.log("============================================");
      for (i = 0; i < data.items.length; i++ ) {
        if (data.items[i].name === playlists[radioId]) {
          var playlist = data.items[i];

          console.log("==========================================");
          console.log("==========================================");

          console.log(playlist);
        }
      }
    },
    error: function() { alert('boo!'); },
    beforeSend: setHeader
  });
}


function setHeader(xhr) {
 var accessToken = window.location.hash.substr(1);
 console.log(accessToken);

 var actualToken = accessToken.substr(13);
 console.log(actualToken);

 xhr.setRequestHeader('Authorization', 'Bearer ' + actualToken);
}


module.exports.getPlaylists = getPlaylists;
