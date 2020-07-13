const Post = require('../models/postModels');

module.exports = app => {
  //landing page (eventaully change to feed page)
  app.get('/', (req, res) => {
    Post.find({})     //finds all the posts in Posts collection
    .lean()           //returns all the posts as javascript objects instead of Mongodb objects
    .then(posts => {
      res.render("posts-index", { posts });     //render to posts-index with the posts found in the previous promises
    })
    //if at any point theres an error with the promises, catch and throw and error
    .catch(err => {
      console.log(err.message);
    });
  });

  //GET form to create new post 
  app.get('/posts/new', (req, res) => {
    res.render('posts-new');    //render to posts-new
  });

  //POST new post to DB
  app.post('/posts/new', (req, res) => {
    const post = new Post(req.body);    //instantiate new post model
    //save new post model to db, then reicriect to home page
    post.save((err, post) => {
      // REDIRECT TO THE ROOT
      return res.redirect(`/`);
    })
  });

  //page to view a specific post
  app.get("/posts/:id", function(req, res) {
    Post.findById(req.params.id).lean()    //look up post by post id and return it as javascript object
      //then render to posts-show with the post tht you found in prev promise
      .then(post => {
        res.render('posts-show', { post });
      })
      //error catcher for any issues in promises
      .catch(err => {
        console.log(err.message);
      });
  });

};