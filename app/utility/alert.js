//renders a page with an alert on it
function send(req, res, title, message){
    res.render('alert', {
        title: title,
        layout: 'primary',
        file: 'alert',
        user : req.user,
        message: message
    });
}

module.exports = {
    send: send
};
