# Alan's Todo
- [X] build out search results page
- [X] convert search page to GET request instead of POST
- [X] clean up search results page
- [X] add availability to user model
- [X] add availability to edit profile capabilities
- [X] add basic mobile CSS to profiles
- [ ] allow for manual game additions
- [ ] build a fetch if not in db, put in db once fetched system
- [ ] build individual games pages by pulling info via API
- [ ] add mobile css to profile, edit pages, search results page, live searches
- [ ] comprehensive logger.js (production-level logging system for catching issues once we're live)
- [ ] add pagination to search results when the database gets big enough

# Edgar's Todo
- [O] add credentials file for passport secret key (change when deployed)

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
- [ ] ctrl+f every file for "properly slug", and slug it

# General Todo
- [ ] connect.session() memorystore is not memory, and will not scale past a single process (designed for a product environment as it will leak process.env.NODE_ENC=production)
- [ ] begin work on Steam, Xbox, PSN, Twitch APIs
- [ ] add messaging other users
- [ ] add blocking other users
- [ ] leaderboards page
- [ ] recatcha on sign up page
- [ ] google analytics