var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('homepage', {
        title: 'wasdWithMe - Connect with gamers.',
        layout: 'primary',
        file: 'homepage',
        user: req.user,
        live_profile_users: getLiveProfileUsers()
    });
});

function getLiveProfileUsers() {
    var liveProfileUsers = [{
        profile_pic: "http://iconshow.me/media/images/Mixed/small-n-flat-icon/png2/64/-profile-filled.png",
        username: "SharpAceX",
        oneUps: 186,
    }, {
        profile_pic: "http://iconshow.me/media/images/Mixed/small-n-flat-icon/png2/64/-profile-filled.png",
        username: "Alan",
        oneUps: 153,
    }, {
        profile_pic: "http://iconshow.me/media/images/Mixed/small-n-flat-icon/png2/64/-profile-filled.png",
        username: "JohnCena",
        oneUps: 135,
    }, {
        profile_pic: "http://iconshow.me/media/images/Mixed/small-n-flat-icon/png2/64/-profile-filled.png",
        username: "Edgar",
        oneUps: 89,
    }, {
        profile_pic: "http://iconshow.me/media/images/Mixed/small-n-flat-icon/png2/64/-profile-filled.png",
        username: "Anteneh",
        oneUps: 64,
    }];
    return liveProfileUsers;
}

module.exports = router;
