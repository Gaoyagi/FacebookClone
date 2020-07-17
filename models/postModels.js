const mongoose = require("mongoose");
const Populate = require("../util/autopopulate");

const Schema = mongoose.Schema;

//model fucntion that executes right before being a new model is saved to db
const PostSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  status: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],     //populate() only works with fields with type: type: Schema.Types.ObjectId
        //ref refers to what collection the schemas  belong to
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  author_id: { type: String },
  likedUsers: [{ type: Schema.Types.ObjectId, ref: "User"}],
  likes: { type: Number }
});

PostSchema.pre("save", function(next) {
  //set updatedat date
  const now = new Date();
  this.updatedAt = now;

  //if created at doesnt have a value, then its also equal to now
  if (!this.createdAt) {
    this.createdAt = now;
  }

  this.author_id = this._id;

  next();   //this promise if finished, go to next one
});

// Always populate the author field
PostSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))
    .pre('findOne', Populate('comments'))
    .pre('find', Populate('comments'))
    .pre('findOne', Populate('likedUsers'))
    .pre('find', Populate('likedUsers'))

module.exports = mongoose.model("Post", PostSchema);