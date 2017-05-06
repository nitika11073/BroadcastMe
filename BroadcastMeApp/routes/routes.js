module.exports = function(app, passport) {

    app.get('/', isLoggedIn, function(req, res) {
        res.render('wall',{
            user : req.user
        });
    });
    
    app.get('/login', function(req, res) {
        res.render('home');
    });

    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    }));
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    }));
    
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}