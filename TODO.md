# Bug List  (oh no!)
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
- [X] add search bar to front page
- [X] work on different homepage when logged in
- [X] work on editing own profile so static temporary data can be removed
- [X] profile change info page or on same page when user is on own page
- [X] change all page titles
- [X] add search bar AJAX for users, games
- [X] create search results page

- [ ] build out search results page
- [ ] allow for manual game additions
- [ ] build individual games pages by pulling info via API
- [ ] add mobile css to profile, edit pages, search results page, live searches

# Edgar's Todo
- [X] fix passport
- [X] set passport-local-mongoose options parameters (attempts:16, time really high,lastLogin, delete username )
- [X] images merge to user.js table, and nested schema, array of nested comments in addition to this
- [X] array one up comments
- [X] fix age problem
- [X] fix plaintext password issue
- [X] add url slugs for mongoose, games
- [X] validation is missing email length
- [X] password needs regex validation as well, should probably not allow users to use spaces in their passwords, but this is open to discussion
- [X] move validation to a separate js file, then call the methods from that
- [X] add credentials file for url for db configure
- [X] test all passport functionality, connect server-side error messages to client-side, test that it all works
- [X] create global function to slug a person's username, include error messages if not sluggable
- [X] ensure usernames only contain contain alphanumeric, numbers, and underscore
- [X] configure heroku environment
- [X] sanitize input for form data
- [X] add live link to heroku site in readme between installation and license

- [O] add credentials file for passport secret key (change when deployed)
- [O] http://blog.ijasoneverett.com/2013/04/form-validation-in-node-js-with-express-validator/ add validator (opted out)

- [ ] Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
- [ ] display error messages on login page just like sign up page
- [ ] if (user.last_activity.minutes < 5) { status = "online"; }
- [ ] db games game.js  & any additional profile stuff
- [ ] bio, first name, last name, checks on user profile , tag line
- [ ] add min/maxLength attributes to ALL input tags where applicable (sign up/login/editting profile)
- [ ] client-side form validation to register and sign in pages
- [ ] add html attributes to input tags
- [ ] add extra field for password confirmation
- [ ] validate that the two passwords are equal
- [ ] ensure usernames only contain contain alphanumeric, numbers, and underscore
- [ ] sanitize input for form data
- [ ] display error messages on login page just like sign up page
- [ ] comprehensive logger.js (production-level logging system for catching issues once we're live)
- [ ] ctrl+f every file for "properly slug", and slug it

# General Todo
- [ ] begin work on Steam, Xbox, PSN, Twitch APIs
- [ ] add messaging other users
- [ ] add blocking other users
- [ ] leaderboards page
- [ ] recatcha on sign up page
- [ ] google analytics