const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema);

app.route('/articles')
    .get((req, res) => {
        Article.find({}).exec((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        })
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if (!err) {
                res.send("successfully added the article to the database")
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany({}).exec((err) => {
            if (!err) {
                res.send("Deleted all the articles successfully");
            } else {
                res.send(err);
            }
        })
    })

// Requests Targeting a specific article

app.route("/articles/:articleTitle")
    .get((req,res)=>{
        const articleTitle = req.params.articleTitle;

        Article.findOne({title: articleTitle}).exec((err,foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle);
            }
            else{
                res.send("No Article Found");
            }
        })
    }
    )
    .put((req,res)=>{
        const articleTitle = req.params.articleTitle;

        Article.replaceOne(
            {title: articleTitle},
            {title: req.body.title, content: req.body.content}).exec((err,foundArticle)=>{
                if(foundArticle){
                    res.send("Article Updated Successfully");
                }
                else{
                    res.send(err);
                }
            });
    })
    .patch((req,res)=>{
        const articleTitle = req.params.articleTitle;
        Article.updateOne(
            {title: articleTitle},
            {$set: req.body}).exec((err,foundArticle)=>{
                if(foundArticle){
                    res.send("Article Updated Successfully");
                }
                else{
                    res.send(err);
                }
            });
    })
    .delete((req,res)=>{
        const articleTitle = req.params.articleTitle;
        Article.deleteOne({title: articleTitle}).exec((err,foundArticle)=>{
            if(foundArticle){
                res.send("Article Delted Successfully");
            }
            else{
                res.send(err);
            }
        });
    })
app.listen(3000, function() {
    console.log("Server started on port 3000");
});