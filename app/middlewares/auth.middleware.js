const isNotAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next(); // user sudah login
    }

    req.flash('error', 'Please login first!');
    res.redirect('/login');
}

//
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/dashboard'); // user sudah login, redirect ke dashboard
    }

    next();
}

export {
    isAuthenticated,
    isNotAuthenticated
};
