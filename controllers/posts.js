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
    Post.findById(req.params.id)    //finds post by passed in ID
      .populate('comments')         //populates the post's comments array with actual comment models  from the id's in the array
      //then render  posts-show with  the found post
      .then((post) => {
        res.render('post-show', { post })
      })
      //if any primise fails then catch and throw an error
      .catch((err) => {
        console.log(err.message)
      })
  });

};