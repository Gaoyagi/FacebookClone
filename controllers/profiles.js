const Post = require('../models/postModels');
const User = require('../models/userModels');

module.exports = app => {
    //displays a users profile, shows their info and all their posts
    app.get('/profile/:id', (req, res) => {
        var currentUser = req.user;                 //gets the user requesting the page
        let profileUser = null                      //temp hold for the user the profile shows
        User.findOne({ _id: req.params.id })        //find the user for the profile
            .populate("friends")               //populates the friend's l
            .lean()                                 //convert that user js object
            .then(user => {
                profileUser = user;
                return Post.find({ author: user._id }) //finds all the posts in Posts collection  
                    .lean();    
            })
            //renders to profile page with current user, profile user, and the posts for the profile
            .then(posts => {
                res.render("profile", { currentUser, profileUser, posts });     //render to posts-index with the posts found in the previous promises
                    //passes in current user to tell the handlebar files if the user was logged in
            })
            //if at any point theres an error with the promises, catch and throw and error
            .catch(err => {
              console.log(err.message);
            });
    });
    
    //add yourself to users friends list
    app.post("/profile/:id/add", (req, res) => {
        let currentUser = req.user;
        let userId = null
        User.findOne({ _id: req.params.id })                 //find the user you want to be friends with
            //add the user id to the firends list and then redirect back to your own profile
            .then(user => {   
                user.friends.push(currentUser._id);                     //add the requested user to the likedUsers list
                user.save();  
                userId = user._id;
            })
            .then(function() {
                return User.findOne({ _id: currentUser._id })
            })
            .then(currUser => {
                currUser.friends.push(userId);                     //add the requested user to the likedUsers list
                currUser.save()                                              //save changes done to user model
                res.redirect(`/profile/${currentUser._id}`);
            })
            .catch(err => {
                console.log(err.message);
            });
    });

    // //add user to your own friend's list
    // app.post("/profile/addback/:id", (req, res) => {
    //     let currentUser = req.user;
    //     console.log(currentUser)
    //     User.findOne({ _id: currentUser._id })                 //find the user you want to be friends with
    //     //add the user id to the firends list and then redirect back to your own profile
    //     .then(user => {   
    //         user.friends.push(currentUser._id);                     //add the requested user to the likedUsers list
    //         user.save();  
    //     })
    //     .then(function() {
    //         return User.findOne({ _id: req.params.id })
    //     })
    //     .then(currUser => {
    //         currUser.friends.push(req.params._id);                     //add the requested user to the likedUsers list
    //         currentUser.save()                                              //save changes done to user model
    //         res.redirect(`/profile/${currentUser._id}`);
    //     })
    //     .catch(err => {
    //         console.log(err.message);
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