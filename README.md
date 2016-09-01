# wasdWithMe

**wasdWithMe** is the online destination to meet and play with gamers.

  - Discover and connect with gamers
  - Set up gaming sessions
  - Browse other gamers' libraries

You can also:
  - Import your game library by connecting your Steam, Xbox Live and Playstation Network account
  - Deck out your profile with your games, achievements and game clips
  - Connect your Twitch account to tell your inner circle when you are live

## Requirements

- [Node.js](http://nodejs.org/) - event-driven, non-blocking I/O for the backend
- [npm](https://www.npmjs.com/) - node package manager
- [MongoDB](https://www.mongodb.com/) - document-oriented database

## Dependencies

**wasdWithMe** uses a number of dependencies to work properly:

* [body-parser](https://www.npmjs.com/package/body-parser) - node.js body parsing middleware
* [connect-flash](https://github.com/jaredhanson/connect-flash) - flash message middleware
* [cookie-parser](https://www.npmjs.com/package/cookie-parser) - cookie parsing with signatures
* [express-debug](https://www.npmjs.com/package/express-debug) - debug toolbar middleware
* [Express](https://expressjs.com/) - fast node.js network app framework
* [express-session](https://www.npmjs.com/package/express-session) - session middleware
* [Handlebars](http://handlebarsjs.com/) - html view engine
* [Mongoose](http://mongoosejs.com/) - mongodb object modeling for node.js
* [mongoose-type-url](https://www.npmjs.com/package/mongoose-type-url) - url field-type for mongoose schemas
* [morgan](https://www.npmjs.com/package/morgan) - http request logger middleware
* [Passport](http://passportjs.org/) - node.js authentication
* [passport-local](https://www.npmjs.com/package/passport-local) - local authentication strategy
* [passport-local-mongoose](https://www.npmjs.com/package/passport-local-mongoose) - simplifies building username and password login with Passport
* [serve-favicon](https://www.npmjs.com/package/serve-favicon) - favicon serving middleware
* [Stylus](http://stylus-lang.com/) - node.js CSS preprocessor

## Other Technologies

* [jQuery](https://jquery.com/) - client-side JavaScript (CDN provided by [Google](https://developers.google.com/speed/libraries/))
* [Google Fonts](https://fonts.google.com/) - source of all our fonts

## Installation

Install node.js, npm, and mongodb, then clone this repository

```sh
$ git clone https://github.com/AlanMorel/wasdWithMe wasdWithMe
```

Install the node dependencies

```sh
$ cd wasdWithMe
$ npm install
```

Edit `config.js` to your liking, then start the app

```sh
$ npm start
```

View in browser at `http://localhost:3000`

## Live Demo

Check out our live demo hosted on [Heroku](http://wasdwithme.herokuapp.com/).


## License

**wasdWithMe** is licensed under the [MIT license](LICENSE).
