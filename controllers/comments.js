const Post = require('../models/postModels');
const Comment = require('../models/commentModels');

module.exports = function(app) {
    // CREATE Comment
    app.post("/posts/:postId/comments", function(req, res) {
        const comment = new Comment(req.body);          //instatiate new comment model
        comment.author = req.user._id;                  //make the author of the comment the requested user
        comment.save()                                  //save new model to db
            //(promise)then find the post that youre commenting on                        
            .then(comment => {
                return Promise.all([
                    Post.findById(req.params.postId)
                ]);
            })
            .then(([post, user]) => {
                post.comments.unshift(comment);
                return Promise.all([
                    post.save()
                ]);
            })
            .then(post => {
                res.redirect(`/posts/${req.params.postId}`);
            })
            .catch(err => {
                console.log(err);
            });
});
};