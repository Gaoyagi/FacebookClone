const Post = require('../models/postModels');
const User = require('../models/userModels');
const { findOne } = require('../models/postModels');

module.exports = app => {
  //main feed
  app.get('/feed', (req, res) => {
    var currentUser = req.user;
    Post.find({})
    .lean()           //returns all the posts as javascript objects instead of Mongodb objects
    .then(posts => {
      res.render("posts-index", { currentUser, posts });     //render to posts-index with the posts found in the previous promises
        //passes in current user to tell the handlebar files if the user was valid
    })
    //if at any point theres an error with the promises, catch and throw and error
    .catch(err => {
      console.log(err.message);
    });
  });

  //GET form to create new post 
  app.get('/posts/new', (req, res) => {
    var currentUser = req.user;     //gets the user requesting the page
    res.render('posts-new', { currentUser });    //render to posts-new
  });

  //POST new post to DB
  app.post('/posts/new', (req, res) => {
    //checks to see if the request is from a user logged in user
    if (req.user) {
      var post = new Post(req.body);        //Instatitate new Post model

      post.author = req.user._id;               //set the author the the requestor
      //save new post model to db, then redirect to home page
      post.save()
        .then(post => {
          return User.findOne({_id: req.user._id}) 
        })
        .then(user => {
          user.posts.unshift(post._id)
          user.save()
          return res.redirect(`/feed`);
        })
        .catch((err) => {
          console.log(err.message)
        });
    //if the requested user isnt logged in, throw an error
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });

  //page to view a specific post
  app.get("/posts/:id", function(req, res) {
    var currentUser = req.user;     //gets the user requesting the page
    Post.findById(req.params.id)    //finds post by passed in ID 
      .lean()                       //returns the post as a  javascript object instead of a mongodb object
      //then render posts-show with  the found post
      .then((post) => {
        res.render('posts-show', { currentUser, post })
      })
      //if any promise fails then catch and throw an error
      .catch((err) => {
        console.log(err.message)
      })
  });

  //Like a Post
  app.put("/posts/:id/like", function(req, res) {
    Post.findOne({ _id: req.params.id })        //find the post based off id
      .then(post => {   
        console.log("this is a likes test")
        console.log(post)
        post.likedUsers.push(req.user._id);       //add the requested user ID to the likedUsers list
        // post.likes = post.likes + 1;           //increase likes by 1
        post.save();                              //save changes done to user model
    
        res.status(200);
      })
      .catch(err => {
        console.log(err.message);
      });
  });
  

};