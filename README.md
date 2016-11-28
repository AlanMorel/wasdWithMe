# WASD With Me

**WASD With Me** is the online destination to meet and play with gamers.
  - Discover and connect with gamers
  - Set up gaming sessions
  - Browse other gamers' libraries

You can also:
  - Import your game library by connecting your Steam, Xbox Live and Playstation Network account
  - Deck out your profile with your games, achievements and game clips
  - Connect your Twitch account to tell your inner circle when you are live

## APIs

* [IGDB API](https://www.igdb.com/api) - video game database api
* [News API](https://newsapi.org/) - live news headlines api (source: [Polygon](https://polygon.com/))
* [Steam API](https://steamcommunity.com/dev) - steam web api
* [Twitch API](https://dev.twitch.tv/) - twitch developers api

## Requirements

- [Node.js](http://nodejs.org/) - event-driven, non-blocking I/O for the backend
- [npm](https://www.npmjs.com/) - node package manager
- [MongoDB](https://www.mongodb.com/) - document-oriented database

## Dependencies

**WASD With Me** uses a number of dependencies to work properly:

* [async](https://www.npmjs.com/package/async) - functions for working with asynchronous JavaScript
* [bluebird](https://www.npmjs.com/package/bluebird) - full featured Promises
* [body-parser](https://www.npmjs.com/package/body-parser) - node.js body parsing middleware
* [connect-flash](https://github.com/jaredhanson/connect-flash) - flash message middleware
* [connect-mongo](https://www.npmjs.com/package/connect-mongo) - mongo session store for express
* [cookie-parser](https://www.npmjs.com/package/cookie-parser) - cookie parsing with signatures
* [express-debug](https://www.npmjs.com/package/express-debug) - debug toolbar middleware
* [Express](https://expressjs.com/) - fast node.js network app framework
* [express-session](https://www.npmjs.com/package/express-session) - session middleware
* [Handlebars](http://handlebarsjs.com/) - html view engine
* [Helmet](http://handlebarsjs.com/) - helps secure express apps with various http headers
* [Mongoose](http://mongoosejs.com/) - mongodb object modeling for node.js
* [morgan](https://www.npmjs.com/package/morgan) - http request logger middleware
* [multer](https://www.npmjs.com/package/multer) - multipart/form-data handling
* [Passport](http://passportjs.org/) - node.js authentication
* [passport-local](https://www.npmjs.com/package/passport-local) - local authentication strategy
* [passport-local-mongoose](https://www.npmjs.com/package/passport-local-mongoose) - simplifies building username and password login with Passport
* [redis](https://www.npmjs.com/package/redis) - redis client library
* [serve-favicon](https://www.npmjs.com/package/serve-favicon) - favicon serving middleware
* [socket.io](https://www.npmjs.com/package/socket.io) - node.js realtime framework server
* [Stylus](http://stylus-lang.com/) - node.js CSS preprocessor
* [unirest](https://www.npmjs.com/package/unirest) - lightweight http client library

## Other Technologies

* [jQuery](https://jquery.com/) - client-side JavaScript (CDN provided by [Google](https://developers.google.com/speed/libraries/))
* [Google Fonts](https://fonts.google.com/) - source of the fonts

## Installation

Install node.js, npm, and mongodb, then clone this repository

```sh
$ git clone https://github.com/AlanMorel/wasdWithMe WASDWithMe
```

Install the node dependencies

```sh
$ cd WASDWithMe
$ npm install
```

Edit `config.js` to your liking, then start the mongodb server in a separate terminal window

```sh
$ ./mongodb-xxxxxxx/bin/mongod
```

Now start the app

```sh
$ npm start
```

View in browser at `http://localhost:3000`

## Live Demo

Check out our live demo hosted on [Heroku](http://wasdwithme.herokuapp.com/). Please note that the code uploaded on Heroku is usually outdated compared to this repository and therefore not an accurate representation of the complete project.


## License

**WASD With Me** is licensed under the [MIT license](LICENSE).

## Screenshots

![alt tag](http://i.imgur.com/is0otGi.png)
![alt tag](http://i.imgur.com/CMNEQeD.png)
![alt tag](http://i.imgur.com/HL5aWSz.png)
![alt tag](http://i.imgur.com/e4rwrHS.png)
