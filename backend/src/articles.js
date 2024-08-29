const mongoose = require('mongoose');
const articleSchema = require('./articleSchema');
const Article = mongoose.model('article', articleSchema);
const userSchema = require('./userSchema');
const User = mongoose.model('user', userSchema);
require('dotenv').config();

const multer = require('multer');
const stream = require('stream');
const cloudinary = require('cloudinary').v2;
const upload = multer({ storage: multer.memoryStorage() });
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


const getArticles = async (req, res) => {
    const id = req.params.id;
    if (id) {
        const isNumber = !isNaN(parseInt(id));
        if (isNumber) {
            const article = await Article.findOne({ pid: id });
            if (!article) {
                return res.sendStatus(404);
            }
            res.send({ articles: [article] });
        } else {
            const author = id;
            const articles = await Article.find({ author: author });
            if (!articles) {
                return res.sendStatus(404);
            }
            res.send({ articles: articles });
        }
    } else {
        const loggedUser = req.username;
        let followedUsers = await User.findOne({ username: loggedUser });
        followedUsers = followedUsers.following;
        const authorsToSearch = [loggedUser, ...followedUsers];
        let articles = await Article.find({ author: { $in: authorsToSearch } });
        res.send({ articles: articles });
    }
}

const putArticle = async (req, res) => {
    const loggedUser = req.username;
    const id = req.params.id;

    const text = req.body.text;
    if (!text) {
        return res.sendStatus(400);
    }
    const article = await Article.findOne({ pid: id });
    if (!article) {
        return res.sendStatus(404);
    }

    const commendId = req.body.commentId;
    if (commendId) {
        if (commendId == -1) {
            article.comments.push({ id: article.comments.length + 1, author: loggedUser, message: text });
        } else {
            const comment = article.comments.find(c => c.id == commendId);
            if (!comment) {
                return res.sendStatus(404);
            }
            if (comment.author !== loggedUser) {
                return res.sendStatus(403);
            }
            comment.message = text;
        }
        await article.save();
        return res.send({ articles: [article] });
    }

    if (article.author !== loggedUser) {
        return res.sendStatus(403);
    }

    article.text = text;
    await article.save();
    res.send({ articles: [article] });
}
const postArticle = async (req, res) => {
    const loggedUser = req.username;
    const text = req.body.text;
    if (!text) {
        return res.sendStatus(400);
    }
    let imageUrl = null;
    if (req.file) {
        imageUrl = await uploadCloudinary(req.file); // assuming uploadImageToCloudinary is an async function
    }


    const count = await Article.countDocuments({});
    const article = new Article({
        pid: count + 1,
        text: text,
        author: loggedUser,
        date: new Date(),
        comments: [],
        image: imageUrl
    });
    await article.save();
    res.send({ articles: [article] });
}

async function uploadCloudinary(file) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                format: 'jpg'
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.url);
                }
            }).end(file.buffer);
    });
}

module.exports = (app) => {
    app.get('/articles/:id?', getArticles);
    app.put('/articles/:id', putArticle);
    app.post('/article', upload.single('image'), postArticle);
};
