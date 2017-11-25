Hardware radio that works with the spotify [web api](https://developer.spotify.com/web-api/)

## Installation

These examples run on Node.js. On [its website](http://www.nodejs.org/download/) you can find instructions on how to install it. You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm.

Once installed, clone the repository and install its dependencies running:

    $ npm install

## Running the examples
In order to run the example, open the folder authorization_code, and run its `app.js` file. For instance, to run the Authorization Code example do:

    $ cd authorization_code
    $ node app.js

## Important on node version
We are using [node-serialPort](https://www.npmjs.com/package/serialport) to access the serial port from the Arduino. In order to not have conflicts use node version 6. This is done by using node version manager [nvm](https://github.com/creationix/nvm). If you don't have it install it either on your own or by using a package manager like [brew](https://brew.sh/)
