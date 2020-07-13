const Post = require('../models/postModels');
const Comment = require('../models/commentModels');

module.exports = function(app) {
    // CREATE Comment
    app.post("/posts/:postId/comments", function(req, res) {
        const comment = new Comment(req.body);          //instatiate new comment model
        comment.save()                                  //save new model to db
             //(promise)then find the post that youre commenting on                        
            .then(comment => {                         
                return Post.findById(req.params.postId);
            })
            //(promise)then add the new comment model to the beginning of the found post's comment array and then save changes to the model
            //not the actual model is  stored, just it's ID
            .then(post => {                             
                post.comments.unshift(comment);  //unshift adds the ID to beginning of the array instead of the end
                return post.save();                   
            })
            //after done with prev promises reidrect to homepage
            .then(post => {                             
                res.redirect(`/`);
            })
            //if  any promises fail then throw error
            .catch(err => {                             
                console.log(err);
            });
    });
};