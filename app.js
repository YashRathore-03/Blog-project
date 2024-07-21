import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import expressEjsLayouts from 'express-ejs-layouts';
import blogRoutes from './routes/blog.js';
import authRoutes from './routes/auth.js';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.set('layout', 'layout');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true
}));

// Middleware to make session data available to all templates
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Use routes
app.use('/', blogRoutes);
app.use('/', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});















