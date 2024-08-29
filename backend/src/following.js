const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const User = mongoose.model('user', userSchema);

const getFollowing = async (req, res) => {
    const username = req.params.user || req.username;
    if (!username) {
        return res.sendStatus(401);
    }
    let user = await User.findOne({ username: username });
    if (!user) {
        return res.status(404);
    }
    res.send({username: username, following: user.following});
}

const putFollowing = async (req, res) => {
    const follow = req.params.user;
    const currentUser = req.username;

    if (!follow) {
        return res.sendStatus(400);
    }

    let user = await User.findOne({ username: currentUser })
    if (!user) {
        return res.status(404);
    }

    let followUser = await User.findOne({ username: follow })
    if (!followUser) {
        return res.status(404).send({ message: 'User or follower not found' });
    }
    if (user.following.includes(follow)) {
        return res.status(409).send({ message: 'User already followed' });
    }

    user.following.push(follow);
    await user.save();

    res.send({username: currentUser, following: user.following})
}

const deleteFollowing = async (req, res) => {
    const follow = req.params.user;
    const currentUser = req.username;
    if (!currentUser) {
        return res.sendStatus(401);
    }
    if (!follow) {
        return res.sendStatus(400);
    }

    let user = await User.findOne({ username: currentUser })
    if (!user) {
        return res.status(404);
    }

    if (!user.following.includes(follow)) {
        return res.status(404);
    }

    user.following = user.following.filter(username => username !== follow);
    await user.save();
    res.send({username: currentUser, following: user.following})
}

module.exports = (app) => {
    app.get('/following/:user?', getFollowing);
    app.put('/following/:user', putFollowing);
    app.delete('/following/:user', deleteFollowing);
};
