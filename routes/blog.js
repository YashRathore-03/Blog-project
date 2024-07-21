import express from 'express';
import { checkAuthenticated } from './auth';

const router = express.Router();
let posts = [];
let comments = [];

// Sample images array
const sampleImages = [
    'https://www.dpreview.com/challenges/DownloadOriginal.aspx?id=841463',
    'https://g2.img-dpreview.com/E060B4BE02B54D24BD0073A0C3CED77B.jpg',
    'https://g4.img-dpreview.com/7963C191584C414DA457827699C3DD82.jpg',
    'https://g4.img-dpreview.com/FE9931CAD80F4304A9714FA5813F34F3.jpg',
    'https://www.dpreview.com/challenges/DownloadOriginal.aspx?id=842049',
    'https://g4.img-dpreview.com/960767AF69174167B9554580FBEFB181.jpg',
    'https://g2.img-dpreview.com/601DE443099245C2BF5977EC9A6569A6.jpg',
    'https://g1.img-dpreview.com/443403E42AD74625956D2095B738E3DE.jpg',
    'https://g2.img-dpreview.com/8C8ECAE284064B40AE71B5D0C75E9894.jpg',
    'https://g1.img-dpreview.com/0524245C15E84E28A0B4493469B355CB.jpg',
    'https://g1.img-dpreview.com/7A913B6572754855B500230FECDB0C94.jpg',
    'https://g4.img-dpreview.com/477363263C4F4F5DA2499AD6422D41F4.jpg',
    'https://g4.img-dpreview.com/2377BA45383444EAA0AC80CC66A11E77.jpg',
    'https://g1.img-dpreview.com/5C060A60743449B087640D2C911E7932.jpg',
    'https://g3.img-dpreview.com/9B6AC8ABCBA942F08875AABA032B4002.jpg',
    'https://g2.img-dpreview.com/7EA8EDFE68B546B1959B1F03DFDE1FBB.jpg',
    'https://g4.img-dpreview.com/31758698DC074C78BAD54D1E033EC41F.jpg',
    'https://g1.img-dpreview.com/63151A9D8542403CB247142A212EDD49.jpg',
    'https://g1.img-dpreview.com/4042217B2F8540CE8774DDEEAECF7DE1.jpg',
    'https://g2.img-dpreview.com/ADA77DD681E847FF868990BF543535FB.jpg'
];

// Adding 20 sample posts with image placeholders
for (let i = 1; i <= 20; i++) {
    posts.push({
        id: i,
        title: `Sample Post ${i}`,
        content: `This is the content of sample post number ${i}. Here we can write about various interesting topics.`,
        imageUrl: sampleImages[i - 1]  // Assign a sample image URL to each post
    });
}

// Middleware to make session data available to all templates
router.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

router.get('/', (req, res) => {
    res.render('index', { posts: posts });
});

router.get('/new', checkAuthenticated, (req, res) => {
    res.render('new');
});

router.post('/', checkAuthenticated, (req, res) => {
    const newPost = { id: posts.length + 1, title: req.body.title, content: req.body.content, imageUrl: req.body.imageUrl || '' };
    posts.push(newPost);
    res.redirect('/');
});

router.get('/:id', (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    const postComments = comments.filter(c => c.postId == req.params.id);
    if (post) {
        res.render('show', { post: post, comments: postComments });
    } else {
        res.status(404).send('Post not found');
    }
});

router.get('/:id/edit', checkAuthenticated, (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (post) {
        res.render('edit', { post: post });
    } else {
        res.status(404).send('Post not found');
    }
});

router.post('/:id', checkAuthenticated, (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (post) {
        post.title = req.body.title;
        post.content = req.body.content;
        post.imageUrl = req.body.imageUrl || post.imageUrl;
        res.redirect('/');
    } else {
        res.status(404).send('Post not found');
    }
});

router.post('/:id/delete', checkAuthenticated, (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    res.redirect('/');
});

router.post('/:id/comment', checkAuthenticated, (req, res) => {
    const comment = { postId: req.params.id, text: req.body.text };
    comments.push(comment);
    res.redirect(`/${req.params.id}`);
});

export default router;