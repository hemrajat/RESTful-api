const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view-engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("article", articleSchema);
//################################ Request targeting all the articles ##################################
app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, articlesFound) {
      if (!err) {
        // console.log(articlesFound);
        res.send(articlesFound);
      } else {
        res.send(err);
      };
    });
  })
  .post(function(req, res) {
    const title = req.body.title;
    const content = req.body.content;
    const article = new Article({
      title: title,
      content: content
    });
    article.save(function(err) {
      if (!err) {
        res.send("successfully added to Db");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("successfully deleted all the articles");
      } else {
        res.send(err);
      };
    });
  });

//################################ Request targeting specific articles ##################################


app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, resultArticle) {
      if (!err) {
        if (resultArticle) {
          res.send(resultArticle);
        } else {
          res.send("No article found");
        };
      } else {
        console.log(err);
      }
    });
  })
  .put(function(req, res) {
    Article.update(
      {title:req.params.articleTitle},
      {title:req.body.title,content:req.body.content},
      {overwrite:true},
      function(err){
      if(!err){
        res.send("successfully updated");
      }else{
        res.send(err);
      };
    });
  });


app.listen(3000, function() {
  console.log("Server started successfully at port 3000");
});
