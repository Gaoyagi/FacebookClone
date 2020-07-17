const Post = require('../models/postModels');

module.exports = app => {
  //landing page (eventaully change to feed page)
  app.get('/feed', (req, res) => {
    var currentUser = req.user;
    
    Post.find({})     //finds all the posts in Posts collection
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
      console.log(req.body)
      post.author = req.user;               //set the author the the requestor
      console.log(req.user)
      post.likedUsers = [];                 //initalize array to hold the ID of the users who liked the post
      post.likes = 0;                       //initalize number of likes the post has
      //save new post model to db, then redirect to home page
      post.save()
        .then(function(err, post) {
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
      .populate('comments')         //populates the post's "comments" array with actual comment models  from the id's in the array
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
    Post.findById(req.params.id).exec(function(err, post) {   //find the post based off id
      post.likedUsers.push(req.user._id);                     //add the requested user to the likedUsers list
      post.likes = post.likes + 1;                            //increase likes by 1
      post.save();                                            //save changes done to user model
  
      res.status(200);
    });
  });
  

};