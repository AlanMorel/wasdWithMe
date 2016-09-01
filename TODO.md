# Bug List  (oh no!)
- [ ] when requesting /login : GET /javascript/login.js results in a 404 error, fix either including
login.js or removing dependency similary requesting / results in GET request /javascript/homepage.js resulting in 404
- [ ] connect.session() memorystore is not memory, and will not scale past a single process (designed for a product environment as it will leak process.env.NODE_ENC=production)

# Alan's Todo
- [X] fetch google fonts via link tags
- [X] create custom 404 error page
- [X] start on footer
- [X] mobile css for homepage
- [X] javascript now loaded after DOM loads
- [X] add live profiles to homepage
- [X] add link to logged in user's own profile once logged in
- [X] retrieve user profile from database via /user/username
- [X] begin work on profile pages
- [X] hook up database data instead of static users for live profiles
- [X] create profile page after database is set up and working
- [X] age is calculated properly now
- [X] continue to populate profile page and improve visuals
- [X] "Game library" section
- [X] add proper mobile.css to signup/register pages
- [X] "message" button when user is not on own page
- [ ] work on editing own profile so static temporary data can be removed
- [ ] work on different homepage when logged in
- [ ] add search bar to front page (maybe this is where AJAX comes into play aka searching for users, games, etc)
- [ ] individual games pages by pulling info via API
- [ ] profile change info page or on same page when user is on own page

# Edgar's Todo
- [X] fix passport
- [X] set passport-local-mongoose options parameters (attempts:16, time really high,lastLogin, delete username )
- [X] images merge to user.js table, and nested schema, array of nested comments in addition to this
- [X] array one up comments
- [X] fix age problem
- [X] fix plaintext password issue
- [X] add url slugs for mongoose, games
- [ ] validation is missing email length
- [ ] password needs regex validation as well, should probably not allow users to use spaces in their passwords, but this is open to discussion
- [ ] move validation to a separate js file, then call the methods from that
- [ ] add credentials file for passport secret key
- [ ] add credentials file for url for db configure
- [ ] test all passport functionality, connect server-side error messages to client-side, test that it all works
- [ ] create global function to slug a person's username, include error messages if not sluggable
- [ ] ensure usernames only contain contain alphanumeric, numbers, and underscore
- [ ] configure heroku environment
- [ ] Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
- [ ] sanitize input for form data
- [ ] display error messages on login page just like sign up page

# Anteneh's Todo
- [ ] client-side form validation to register and sign in pages
- [ ] add html attributes to input tags
- [ ] populate static data schemas
- [ ] add extra field for password confirmation
- [ ] validate that the two passwords are equal
- [ ] ensure usernames only contain contain alphanumeric, numbers, and underscore
- [ ] leaderboards page
- [ ] sanitize input for form data
- [ ] display error messages on login page just like sign up page

# General Todo
- [ ] allow for manual game additions
- [ ] begin work on Steam, Xbox, PSN, Twitch APIs
- [ ] add messaging other users
- [ ] add blocking other users
