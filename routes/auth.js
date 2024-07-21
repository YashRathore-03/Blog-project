import express from 'express';
import bcrypt from 'bcrypt';
import session from 'express-session';

const router = express.Router();
let users = [];

// Configure session middleware
router.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Middleware to make session data available to all templates
router.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Render the registration form
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle user registration
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { id: Date.now(), username: req.body.username, password: hashedPassword };
        users.push(user);
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
});

// Render the login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle user login
router.post('/login', async (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    if (user == null) {
        return res.redirect('/login');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            req.session.userId = user.id;
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    } catch {
        res.redirect('/login');
    }
});

// Handle user logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Check if the user is authenticated
export function checkAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

export default router;
