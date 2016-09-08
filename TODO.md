# Alan's Todo
- [X] build out search results page
- [X] convert search page to GET request instead of POST
- [X] clean up search results page
- [X] add availability to user model
- [X] add availability to edit profile capabilities
- [X] add basic mobile CSS to profiles
- [X] add mobile css to search results page
- [X] add mobile css to live searches
- [X] add failed/empty search results page
- [X] allow for manual game additions
- [X] logger.js (production-level logging system for catching issues once we're live)
- [X] build a fetch if not in db, put in db once fetched system
- [ ] build individual games pages by pulling info via API
- [ ] implement search filters
- [ ] add pagination to search results when the database gets big enough

# Edgar's Todo
- [O] add credentials file for passport secret key (change when deployed)

- [ ] Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
- [ ] display error messages on login page just like sign up page
- [ ] if (user.last_activity.minutes < 5) { status = "online"; }
- [ ] db games game.js  & any additional profile stuff
- [ ] bio, first name, last name, checks on user profile , tag line
- [ ] add min/maxLength attributes to ALL input tags where applicable (sign up/login/editing profile)
- [ ] client-side form validation to register and sign in pages
- [ ] add html attributes to input tags
- [ ] add extra field for password confirmation
- [ ] validate that the two passwords are equal
- [ ] ensure usernames only contain contain alphanumeric, numbers, and underscore
- [ ] sanitize input for form data
- [ ] display error messages on login page just like sign up page
- [ ] ctrl+f every file for "properly slug", and slug it

# General Todo
- [ ] begin work on Steam, Xbox, PSN, Twitch APIs
- [ ] add messaging other users
- [ ] add blocking other users
- [ ] build out footer
- [ ] leaderboards page
- [ ] recatcha on sign up page
- [ ] google analytics
- [ ] before launch: https://expressjs.com/en/advanced/best-practice-security.html