export default function isLoggedIn(req, res, next) {
    if (!req.cookies.loggedin) {
        res.redirect('/login')
        return;
    }
    res.cookie('loggedin', true, {maxAge: 60000});
    next();
}