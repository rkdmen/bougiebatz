var express = require('express');
var router = express.Router();

//require "likes" model
var Article = require('../models/articleModel');

//post request to the database
//logic is somewhat more involved here
//when a POST request hits, you first use .findOne to determine whether the
//article is in the database in the first place. if it's not, then
//you are instantiating a new data entry
//otherwise, you are using findOneAndUpdate using the _id that is passed out
//as a result of .findOne, and then incrementing the 'likes' for that article
router.post('/article', function(req, res){

  Article.findOne({"articleData.title": req.body.title}, function(err,article){
    if(err){
      //error in finding
      res.json(err);
    } else if(article === null){
      //means article not in database, so add
      var likedArticle = new Article({
        'numberLikes': 1,
        'articleData': req.body,
        'commentData': []
      });
      likedArticle.save(function(err) {
        if (err) console.log('Error on save!');
        else res.sendStatus(201);
      })
    } else {
      var id = article._id.toString();
      Article.findOneAndUpdate(
        { _id: id },
        { $inc: { numberLikes: 1 } },
        { new: true },
        function(err,success){
          if(err) console.log(err);
          else res.sendStatus(200);
        }
      )
    }
  })

});

router.get('/article', function(req, res){
  //get all links from the db
  Article.find({}, function(err, articles) {
    res.send(articles);
  });
});

router.post('/comment', function(req, res){

  Article.findOne({"articleData.title": req.body.article.title}, function(err,article){
    if(err){
      //error in finding
      res.json(err);
    } else if(article === null){
      //means article not in database, so add
      var commentArticle = new Article({
        'numberLikes': 0,
        'articleData': req.body.article,
        'commentData': req.body.commentData

      });
      commentArticle.save(function(err) {
        if (err) console.log('Error on save!')
        else res.sendStatus(201)
      })
    } else {
      var id = article._id.toString();
      articleId_ = id;

      Article.findOneAndUpdate(
        { _id: id },
        { $push: { commentData: req.body.commentData } },
        { new: true },
        function(err,success){
          if(err) { console.log(err); }
          console.log("Success Comment added!");
        }
      )
    }
  })

});

router.get('/comment', function(req, res){

    var articleObject = JSON.parse(req.query.article)

    Article.find({}, function(err, found) {

      //Filtering array of Article objects by Title
      var filtered = found.filter(function(article){
        return article.articleData.title === articleObject.title;
      })
      if(filtered.length !== 0){
        res.send(filtered[0].commentData);
      }
      if(filtered.length === 0){
        var commentArticle = new Article({
          'numberLikes': 0,
          'articleData': articleObject,
          'commentData': ''
      });
      commentArticle.save(function(err) {
        if (err) console.log('Error on save!')
        else res.sendStatus(201)
      })
      }

  });

})

module.exports = router;