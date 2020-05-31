const mongoose = require("mongoose");
const User = mongoose.model("User");

const PasswordSchema = new mongoose.Schema(
  {
    secret: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
    approvals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    disapprovals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

PasswordSchema.methods.updateAuthorPoints = function(willIncrement) {
  return User.findById(this.author)
    .then(author => {
      return willIncrement
        ? author.incrementPoints()
        : author.decrementPoints();
    });
}

PasswordSchema.methods.approve = async function(user) {
  if (this.approvals.indexOf(user._id) === -1) {
    this.approvals = this.approvals.concat([user._id]);
  }
  return await this.save();
};

PasswordSchema.methods.disapprove = async function(user) {
  if (this.disapprovals.indexOf(user._id) === -1) {
    this.disapprovals = this.disapprovals.concat([user._id]);
  }
  return await this.save();
};

PasswordSchema.methods.unapprove = async function(user) {
  this.approvals.remove(user._id);
  await this.updateAuthorPoints(false);
  return await this.save();
};

PasswordSchema.methods.undisapprove = async function(user) {
  this.disapprovals.remove(user._id);
  await this.updateAuthorPoints(true);
  return await this.save();
};

// Requires population of author
PasswordSchema.methods.toJSONFor = function(user) {
  return {
    id: this._id,
    secret: this.secret,
    approvals: this.approvals,
    disapprovals: this.disapprovals,
    rating: this.approvals.length - this.disapprovals.length,
    createdAt: this.createdAt,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model("Password", PasswordSchema);
