/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
// var jsdom = require('jQuery');
// var jsdom = require("jsdom");
// var window = jsdom.jsdom().parentWindow;
//
// jsdom.jQueryify(window, "http://code.jquery.com/jquery-2.1.3.min.js", function () {
//   var $ = window.$;
//   $("body").prepend("<h1>The title</h1>");
//   console.log($("h1").html());
// });

var request = require('request');
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = 'f350b06e1ffc46cca3c34fc86c5ec9c7'; // Your client id
var client_secret = 'f9da10c0119a4145abeb3e5fc06b8265'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

var headers = {
  'Authorization': 'Bearer BQBIQvS_PK9L9ON24LLeHZPX9OT6YmQVnGhuJcRv7QjQ8QGND3v0-2nQ5NUthmLM0seK1ySrfsjOt7PrBObnVqrugKcURakQx4Gws6zKP3p3Klg_3zT_hZWEn5tdMEzO64_-w2oGbB6cwSk7FmWiwjpIUj_tGEpRPW0zQvOxTHxkkGqcC962ptR4SjR8t0GOWtUvTU22lezBCCCMhtEHdUrcXlzmkas_QgSX9eZUkMtCeST8l_ht_VvzZeXGACQlBWMjMITf7Nj08Ns'
}

// Configure the request
var optionsPlaylists = {
    url: 'https://api.spotify.com/v1/users/kuznetsova.vv/playlists',
    method: 'GET',
    headers: headers
}

var myArray = {
  "1": "Release Radar",
  "2": "Discover Weekly",
};

var arrayId = 2;

function callSpotify(error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        //console.log(body)
        console.log("Here I start");
        console.log(arrayId);
        var response = JSON.parse(body);
        for (i = 0; i < response.items.length; i++ ) {
          // console.log(myArray);
          if (response.items[i].name === myArray[arrayId]) {
            var playlist = response.items[i];
            console.log(playlist);
            console.log("KKKKKK");

            console.log(playlist.id);
            console.log(playlist.external_urls);

            var external_urls = playlists.external_urls;

            var optionsJustOnePlaylist = {
                url: '	https://api.spotify.com/v1/me/player/play',
                method: 'GET',
                body:    "context_uri=spotify:user:spotify:playlist:37i9dQZEVXcE8HrDROGOx6",
                headers: headers
            }

            request(optionsJustOnePlaylist, function() {
              console.log("sucess")
            })

            // request()
          }
        }
    }
}
// Start the request
request(optionsPlaylists, callSpotify);


var SerialPort = require('serialport');

  var port = new SerialPort('/dev/cu.usbmodem2462301', {
    baudRate: 57600
  });

  port.on('open', () => {
    console.log('Port Opened');
  });

  var currentPlaylist;
  var currentVolume;
  var playlists = 4; //Victoria we need your code for this. This changed with how many playlists we get from spotify.

  port.on('data', (data) => {
    /* get a buffer of data from the serial port */
    //console.log(data.toString());

    if((data.toString() > 0) && (data.toString()<1000)){
      currentPlaylist = data.toString();
      currentPlaylist = parseInt(((currentPlaylist - 0) / (1000 - 0) * (playlists + 1 - 1) + 1));
      getPlaylists(currentPlaylist);
    } else if ((data.toString()>1001) && (data.toString()<2000)) {
      currentVolume = data.toString();
      currentVolume = parseInt((currentVolume-1000)/10);
    } else {
      console.log('unknown serial O.o')
    }

    console.log('Playlist: ', currentPlaylist);
    console.log('Volume: ', currentVolume);

  });


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);
