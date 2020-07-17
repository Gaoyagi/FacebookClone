const Post = require('../models/postModels');
const User = require('../models/userModels');

module.exports = app => {
    app.get('/profile/:id', (req, res) => {
        // var currentUser = req.user;           //gets user requesting the site
        // User.find({ _id: req.params.id })     //finds the user you're whose profile youre visiting
        // .lean()           //returns all the posts as javascript objects instead of Mongodb objects
        // .then(user => {
        //     console.log(user)
        //     var posts = user.posts.populate('posts')          //get all the posts that the profile user has made
        //     res.render("profile", { currentUser, user, posts });     //render to posts-index with the posts found in the previous promises
        //         //passes in current user to tell the handlebar files if the user was logged in
        // })
        // //if at any point theres an error with the promises, catch and throw and error
        // .catch(err => {
        //   console.log(err.message);
        // });
        var currentUser = req.user;     //gets the user requesting the page
        User.find({ _id: req.params.id })
            .lean()
            .then(user => {
                console.log(user)
                res.render("profile", { currentUser, user });     //render to posts-index with the posts found in the previous promises
                    //passes in current user to tell the handlebar files if the user was logged in
            })
            //if at any point theres an error with the promises, catch and throw and error
            .catch(err => {
              console.log(err.message);
            });
    });
    
    // //add a friend
    // app.put("/profile/:id/add-friend", function(req, res) {
    //     Post.findById(req.params.id).exec(function(err, post) {   //find the post based off id
    //         post.likedUsers.push(req.user._id);                     //add the requested user to the likedUsers list
    //         post.likes = post.likes + 1;                            //increase likes by 1
    //         post.save();                                            //save changes done to user model

    //         res.status(200);
    //     });
    // });

    // //remove a friend
    // app.put("/profile/:id/remove-friend", function(req, res) {
    //     Post.findById(req.params.id).exec(function(err, post) {   //find the post based off id
    //         post.likedUsers.push(req.user._id);                     //add the requested user to the likedUsers list
    //         post.likes = post.likes + 1;                            //increase likes by 1
    //         post.save();                                            //save changes done to user model

    //         res.status(200);
    //     });
    // });

};