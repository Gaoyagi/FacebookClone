const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//model fucntion that executes right before being a new model is saved to db
const PostSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  title: { type: String, required: true },
  url: { type: String, required: true },
  summary: { type: String, required: true }
});

PostSchema.pre("save", function(next) {
  //set updatedat date
  const now = new Date();
  this.updatedAt = now;

  //if created at doesnt have a value, then its also equal to now
  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();   //this promise if finished, go to next one
});

module.exports = mongoose.model("Post", PostSchema);