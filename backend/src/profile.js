const mongoose = require('mongoose');
const profileSchema = require('./profileSchema');
const Profile = mongoose.model('profile', profileSchema);
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

const putHeadline = async (req, res) => {
    const username = req.username;
    const headline = req.body.headline;

    if (!headline) {
        return res.sendStatus(400);
    }

    let profile = await Profile.findOne({ username: username });
    if (!profile) {
        return res.sendStatus(401);
    }

    profile.headline = headline;
    await profile.save();
    res.send({username: username, headline: headline});
}

const getHeadline = async (req, res) => {
    const username = req.params.user || req.username;
    if (!username) {
        return res.sendStatus(401);
    }
    let profile = await Profile.findOne({ username: username });
    if (!profile) {
        return res.status(404);
    }
    res.send({username: username, headline: profile.headline});
}

const getEmail = async (req, res) => {
    const username = req.params.user || req.username;
    if (!username) {
        return res.sendStatus(401);
    }
    let profile = await Profile.findOne({ username: username });
    if (!profile) {
        return res.status(404);
    }
    res.send({username: username, email: profile.email});
}

const putEmail = async (req, res) => {
    const username = req.username;
    const email = req.body.email;

    if (!email) {
        return res.sendStatus(400);
    }
    let profile = await Profile.findOne({ username: username });
    if (!profile) {
        return res.sendStatus(401);
    }

    profile.email = email;
    await profile.save();
    res.send({username: username, email: email});
}

const getDob = async (req, res) => {
    const username = req.params.user || req.username;
    if (!username) {
        return res.sendStatus(401);
    }
    let profile = await Profile.findOne({ username: username });
    if (!profile) {
        return res.status(404);
    }
    res.send({username: username, dob: profile.dob});
}

const getZipcode = async (req, res) => {
    const username = req.params.user || req.username;
    if (!username) {
        return res.sendStatus(401);
    }
    let profile = await Profile.findOne({ username: username });
    if (!profile) {
        return res.status(404);
    }
    res.send({username: username, zipcode: profile.zipcode});
}

const putZipcode = async (req, res) => {
    const username = req.username;
    const zipcode = req.body.zipcode;

    if (!zipcode) {
        return res.sendStatus(400);
    }

    let profile = await Profile.findOne({ username: username });
    if (!profile) {
        return res.sendStatus(401);
    }

    profile.zipcode = zipcode;
    await profile.save();
    res.send({username: username, zipcode: zipcode});
}

const getPhone = async (req, res) => {
    const username = req.params.user || req.username;
    if (!username) {
        return res.sendStatus(401);
    }
    let profile = await Profile.findOne({ username: username });
    if (!profile) {
        return res.status(404);
    }
    res.send({username: username, phone: profile.phone});
}

const putPhone = async (req, res) => {
    const username = req.username;
    const phone = req.body.phone;

    if (!phone) {
        return res.sendStatus(400);
    }

    let profile = await Profile.findOne({ username: username });
    if (!profile) {
        return res.sendStatus(401);
    }

    profile.phone = phone;
    await profile.save();
    res.send({username: username, phone: phone});
}

const getDisplayname = async (req, res) => {
    const username = req.params.user || req.username;
    if (!username) {
        return res.sendStatus(401);
    }
    let profile = await Profile.findOne({ username: username });
    if (!profile) {
        return res.status(404);
    }
    res.send({username: username, displayname: profile.displayname});
}

const putDisplayname = async (req, res) => {
    const username = req.username;
    const displayname = req.body.displayname;

    if (!displayname) {
        return res.sendStatus(400);
    }

    let profile = await Profile.findOne({ username: username });

    if (!profile) {
        return res.sendStatus(401);
    }

    profile.displayname = displayname;
    await profile.save();
    res.send({username: username, displayname: displayname});
}

const getAvatar = async (req, res) => {
    const username = req.params.user || req.username;
    if (!username) {
        return res.sendStatus(401);
    }
    let profile = await Profile.findOne({ username: username });
    if (!profile) {
        return res.status(404);
    }
    res.send({username: username, avatar: profile.avatar});
}

const putAvatar = async (req, res) => {

    let avatar = null;

    if(req.file) {
        avatar = await uploadCloudinary(req.file); // assuming uploadImageToCloudinary is an async function
    }
    const username = req.username;
    let profile = await Profile.findOne({ username: username });
    if (!profile) {
        return res.sendStatus(401);
    }

    profile.avatar = avatar;
    await profile.save();
    res.send({username: username, avatar: avatar});
}

const getProfile = async (req, res) => {
    const username = req.params.user || req.username;
    if (!username) {
        return res.sendStatus(401);
    }
    let profile = await Profile.findOne({ username: username });
    if (!profile) {
        return res.status(404);
    }
    res.send({username: username, headline: profile.headline, email: profile.email, zipcode: profile.zipcode, dob: profile.dob, avatar: profile.avatar, phone: profile.phone, displayname: profile.displayname});
}

// Async function to handle image upload
async function uploadCloudinary(file) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { 
                resource_type: 'auto', 
                format: 'jpg'
            }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.url);
            }
        }).end(file.buffer);
    });
}

module.exports = (app) => {
    app.put('/headline', putHeadline);
    app.get('/headline/:user?', getHeadline);
    app.put('/email', putEmail);
    app.get('/email/:user?', getEmail);
    app.get('/dob/:user?', getDob);
    app.get('/zipcode/:user?', getZipcode);
    app.put('/zipcode', putZipcode);
    app.get('/phone/:user?', getPhone);
    app.put('/phone', putPhone);
    app.get('/avatar/:user?', getAvatar);
    app.put('/avatar', upload.single('image'), putAvatar);
    app.get('/profile/:user?', getProfile);
    app.put('/displayname', putDisplayname);
    app.get('/displayname/:user?', getDisplayname);
};
