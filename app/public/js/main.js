(function() {

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
      userProfileTemplate = Handlebars.compile(userProfileSource),
      userProfilePlaceholder = document.getElementById('user-profile');

  var oauthSource = document.getElementById('oauth-template').innerHTML,
      oauthTemplate = Handlebars.compile(oauthSource),
      oauthPlaceholder = document.getElementById('oauth');

  var params = getHashParams();

  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });

      $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            userProfilePlaceholder.innerHTML = userProfileTemplate(response);

            $('#login').hide();
            $('#loggedin').show();
          }
      });
    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }

    document.getElementById('obtain-new-token').addEventListener('click', function() {
      $.ajax({
        url: '/refresh_token',
        data: {
          'refresh_token': refresh_token
        }
      }).done(function(data) {
        access_token = data.access_token;
        oauthPlaceholder.innerHTML = oauthTemplate({
          access_token: access_token,
          refresh_token: refresh_token
        });
      });
    }, false);
  }
})();

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


// var test = function() {
//   console.log("Hello wold");
// }
