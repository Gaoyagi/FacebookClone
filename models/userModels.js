const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Populate = require("../util/autopopulate");

const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  password: { type: String, select: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  bday: { type: String, required: true },
  friend_num: { type: Number },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

//fucntion that executes right before model is saved to db
UserSchema.pre("save", function(next) {
  //sets createdAt AND updatedAt dates
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  //encrypt the password via bcrypt
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  //salts the fpassword (what does salting do?)
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });

  this.friend_num = 0;
});

//Model function to compare the passed in password with the models password (only works on mongodb objects, cant call lean() on it)
UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);