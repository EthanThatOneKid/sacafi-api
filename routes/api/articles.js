const router = require("express").Router();
const mongoose = require("mongoose");
const Article = mongoose.model("Article");
const Comment = mongoose.model("Comment");
const Password = mongoose.model("Password");
const User = mongoose.model("User");
const auth = require("../auth");

// Preload article objects on routes with ':article'
router.param("article", function(req, res, next, slug) {
  Article.findOne({ slug: slug })
    .populate("author")
    .then(function(article) {
      if (!article) {
        return res.sendStatus(404);
      }
      req.article = article;
      return next();
    })
    .catch(next);
});

router.param("comment", function(req, res, next, id) {
  Comment.findById(id)
    .then(function(comment) {
      if (!comment) {
        return res.sendStatus(404);
      }
      req.comment = comment;
      return next();
    })
    .catch(next);
});

router.param("password", function(req, res, next, id) {
  Password.findById(id)
    .then(function(password) {
      if (!password) {
        return res.sendStatus(404);
      }
      req.password = password;
      return next();
    })
    .catch(next);
});

router.get("/", auth.optional, function(req, res, next) {
  let query = {};
  let limit = 20;
  let offset = 0;
  if (typeof req.query.bbox !== "undefined") {
    const [west, south, east, north] = req.query.bbox.split(",").map(Number);
    query.location = {
      $geoWithin: {
        $box: [[west, north], [east, south]]
      }
    };
  }
  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }
  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }
  if (typeof req.query.tag !== "undefined") {
    query.tagList = { $in: [req.query.tag] };
  }
  Promise.all([
    req.query.author ? User.findOne({ username: req.query.author }) : null,
    req.query.favorited ? User.findOne({ username: req.query.favorited }) : null
  ])
    .then(function(results) {
      const [author, favoriter] = results;
      if (author) {
        query.author = author._id;
      }
      if (favoriter) {
        query._id = { $in: favoriter.favorites };
      } else if (req.query.favorited) {
        query._id = { $in: [] };
      }
      return Promise.all([
        Article.find(query)
          .limit(Number(limit))
          .skip(Number(offset))
          .sort({ createdAt: "desc" })
          .populate("author")
          .exec(),
        Article.count(query).exec(),
        req.payload ? User.findById(req.payload.id) : null
      ]);
    })
    .then(function(results) {
      const [articles, articlesCount, user] = results;
      return res.json({
        articles: articles.map(function(article, i) {
          return article.toJSONFor(user);
        }),
        articlesCount: articlesCount
      });
    })
    .catch(next);
});

router.get("/feed", auth.required, function(req, res, next) {
  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }

  User.findById(req.payload.id).then(function(user) {
    if (!user) {
      return res.sendStatus(401);
    }

    Promise.all([
      Article.find({ author: { $in: user.following } })
        .limit(Number(limit))
        .skip(Number(offset))
        .populate("author")
        .exec(),
      Article.count({ author: { $in: user.following } })
    ])
      .then(function(results) {
        var articles = results[0];
        var articlesCount = results[1];

        return res.json({
          articles: articles.map(function(article) {
            return article.toJSONFor(user);
          }),
          articlesCount: articlesCount
        });
      })
      .catch(next);
  });
});

router.post("/", auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      var article = new Article(req.body.article);

      article.author = user;

      return article.save().then(function() {
        return res.json({ article: article.toJSONFor(user) });
      });
    })
    .catch(next);
});

// return a article
router.get("/:article", auth.optional, function(req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.article.populate("author").execPopulate()
  ])
    .then(function(results) {
      var user = results[0];

      return res.json({ article: req.article.toJSONFor(user) });
    })
    .catch(next);
});

// update article
router.put("/:article", auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user) {
    if (req.article.author._id.toString() === req.payload.id.toString()) {
      if (typeof req.body.article.title !== "undefined") {
        req.article.title = req.body.article.title;
      }

      if (typeof req.body.article.description !== "undefined") {
        req.article.description = req.body.article.description;
      }

      if (typeof req.body.article.tagList !== "undefined") {
        req.article.tagList = req.body.article.tagList;
      }

      req.article
        .save()
        .then(function(article) {
          return res.json({ article: article.toJSONFor(user) });
        })
        .catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete article
router.delete("/:article", auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      if (req.article.author._id.toString() === req.payload.id.toString()) {
        return req.article.remove().then(function() {
          return res.sendStatus(204);
        });
      } else {
        return res.sendStatus(403);
      }
    })
    .catch(next);
});

// Favorite an article
router.post("/:article/favorite", auth.required, function(req, res, next) {
  var articleId = req.article._id;

  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return user.favorite(articleId).then(function() {
        return req.article.updateFavoriteCount().then(function(article) {
          return res.json({ article: article.toJSONFor(user) });
        });
      });
    })
    .catch(next);
});

// Unfavorite an article
router.delete("/:article/favorite", auth.required, function(req, res, next) {
  var articleId = req.article._id;

  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return user.unfavorite(articleId).then(function() {
        return req.article.updateFavoriteCount().then(function(article) {
          return res.json({ article: article.toJSONFor(user) });
        });
      });
    })
    .catch(next);
});

// return an article's comments
router.get("/:article/comments", auth.optional, function(req, res, next) {
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null)
    .then(function(user) {
      return req.article
        .populate({
          path: "comments",
          populate: {
            path: "author"
          },
          options: {
            sort: {
              createdAt: "desc"
            }
          }
        })
        .execPopulate()
        .then(function(article) {
          return res.json({
            comments: req.article.comments.map(function(comment) {
              return comment.toJSONFor(user);
            })
          });
        });
    })
    .catch(next);
});

// create a new comment
router.post("/:article/comments", auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      var comment = new Comment(req.body.comment);
      comment.article = req.article;
      comment.author = user;

      return comment.save().then(function() {
        req.article.comments = req.article.comments.concat(comment);

        return req.article.save().then(function(article) {
          res.json({ comment: comment.toJSONFor(user) });
        });
      });
    })
    .catch(next);
});

router.delete("/:article/comments/:comment", auth.required, function(
  req,
  res,
  next
) {
  if (req.comment.author.toString() === req.payload.id.toString()) {
    req.article.comments.remove(req.comment._id);
    req.article
      .save()
      .then(
        Comment.find({ _id: req.comment._id })
          .remove()
          .exec()
      )
      .then(function() {
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

// Create a new password
router.post("/:article/passwords", auth.required, function(req, res, next) {
  let password, user;
  User.findById(req.payload.id)
    .then(function(_user) {
      if (!_user) {
        return res.sendStatus(401);
      }
      user = _user;
      password = new Password(req.body.password);
      password.article = req.article;
      password.author = user;
      return password.save();
    })
    .then(function() {
      req.article.passwords = req.article.passwords.concat(password);
      return req.article.save();
    })
    .then(function(article) {
      res.json({ password: password.toJSONFor(user) });
    })
    .catch(next);
});

router.delete("/:article/passwords/:password", auth.required, function(
  req,
  res,
  next
) {
  if (req.password.author.toString() === req.payload.id.toString()) {
    req.article.passwords.remove(req.password._id);
    req.article
      .save()
      .then(
        Password.find({ _id: req.password._id })
          .remove()
          .exec()
      )
      .then(function() {
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

// Return an article's passwords
router.get("/:article/passwords", auth.required, function(req, res, next) {
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null)
    .then(function(user) {
      return req.article
        .populate({
          path: "passwords",
          populate: {
            path: "author"
          },
          options: {
            sort: {
              createdAt: "desc"
            }
          }
        })
        .execPopulate()
        .then(function(article) {
          return res.json({
            passwords: req.article.passwords
              .map(function(password) {
                return password.toJSONFor(user);
              })
              .sort(function(a, b) {
                return b.rating - a.rating;
              })
          });
        });
    })
    .catch(next);
});

// Approve a password
router.post("/:article/passwords/:password/approve", auth.required, function(req, res, next) {
  let user;
  User.findById(req.payload.id)
    .then(function(_user) {
      if (!_user) {
        return res.sendStatus(401);
      }
      user = _user;
      return req.password.approve(user);
    })
    .then(function() {
      return req.password.undisapprove(user);
    })
    .then(function() {
      return res.json({ article: req.article.toJSONFor(user) });
    })
    .catch(next);
});

// Unapprove a password
router.delete("/:article/passwords/:password/approve", auth.required, function(req, res, next) {
  let user;
  User.findById(req.payload.id)
    .then(function(_user) {
      if (!_user) {
        return res.sendStatus(401);
      }
      user = _user;
      return req.password.unapprove(user);
    })
    .then(function() {
      return res.json({ article: req.article.toJSONFor(user) });
    })
    .catch(next);
});

// Disapprove a password
router.post("/:article/passwords/:password/disapprove", auth.required, function(req, res, next) {
  let user;
  User.findById(req.payload.id)
    .then(function(_user) {
      if (!_user) {
        return res.sendStatus(401);
      }
      user = _user;
      return req.password.disapprove(user);
    })
    .then(function() {
      return req.password.unapprove(user);
    })
    .then(function() {
      return res.json({ article: req.article.toJSONFor(user) });
    })
    .catch(next);
});

// Undisapprove a password
router.delete("/:article/passwords/:password/disapprove", auth.required, function(req, res, next) {
  let user;
  User.findById(req.payload.id)
    .then(function(_user) {
      if (!_user) {
        return res.sendStatus(401);
      }
      user = _user;
      return req.password.undisapprove(user);
    })
    .then(function() {
      return res.json({ article: req.article.toJSONFor(user) });
    })
    .catch(next);
});

module.exports = router;