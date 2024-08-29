const md5 = require('md5');
const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const profileSchema = require('./profileSchema');
let sessionUser = {};
let cookieKey = "sid";

const User = mongoose.model('user', userSchema);
const Profile = mongoose.model('profile', profileSchema);

function isLoggedIn(req, res, next) {
    if (!req.cookies) {
       return res.sendStatus(401);
    }

    let sid = req.cookies[cookieKey];
    if (!sid) {
        return res.sendStatus(401);
    }

    let username = sessionUser[sid];
    if (username) {
        req.username = username;
        next();
    } else {
        return res.sendStatus(401);
    }
}

async function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        return res.sendStatus(400);
    }

    const user = await User.findOne({ username: username });
    if (!user) {
        return res.sendStatus(401);
    }

    let hash = md5(user.salt + password);
    if (hash === user.hash) {
        let salt = username + new Date().getTime();
        let sid = md5(salt);
        sessionUser[sid] = username;

        res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, secure: true, sameSite: 'None' });
        res.send({username: username, result: 'success'});
    } else {
        res.sendStatus(401);
    }
}

function logout(req, res) {
    const sid = req.cookies[cookieKey];
    if (sid) {
        delete sessionUser[sid];
        res.clearCookie(cookieKey);
        res.send("OK");
    } else {
        res.sendStatus(401);
    }
}

async function register(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let dob = req.body.dob;
    let phone = req.body.phone;
    let zipcode = req.body.zipcode;
    let displayname = req.body.displayname;

    if (!username || !password || !email || !dob || !phone || !zipcode) {
        return res.sendStatus(400);
    }

    const existUser = await User.findOne({ username: username });
    if (existUser) {
        return res.status(409).send({ message: "Username already in use." });
    }
    let salt = username + new Date().getTime();
    let hash = md5(salt + password);
    
    let newUser = new User(
        {
            username: username,
            created: new Date(),
            salt: salt,
            hash: hash,
            followedUsers: [],
        }
    );
    await newUser.save();
    let newProfile = new Profile(
        {
            username: username,
            headline: "",
            displayname: displayname,
            phone: phone,
            zipcode: zipcode,
            dob: dob,
            email: email,
            avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
        }
    )
    await newProfile.save();

    res.send({result: 'success', username: username});
}

async function updatePassword(req, res) {
    let newPassword = req.body.password;
    if (!newPassword) {
        return res.sendStatus(400);
    }

    let username = req.username;
    const user = await User.findOne({ username: username });
    if (!user) {
        return res.sendStatus(401);
    }

    let salt = user.salt;
    let newHash = md5(salt + newPassword);

    user.hash = newHash;
    await user.save();
    res.send({ username: username, result: 'success' });
}

module.exports = (app) => {
    app.post('/login', login);
    app.post('/register', register);
    app.use(isLoggedIn);
    app.put('/password', updatePassword); 
    app.put('/logout', logout);    
};
