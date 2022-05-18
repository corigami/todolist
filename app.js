const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
var new_items = ['Thing 1', 'Thing 2', 'Thing 3'];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');


app.listen(3000, function () {
    console.log("Web server running on port 3000");
});

app.get("/", response);
app.post("/", post_action);

app.get("/about", function(req,res){
    res.render("about");
});

function response(req, res) {
    var date_opts = {
        weekday: "long",
        day: 'numeric',
        month: 'long'
    };
    var day_of_wk = new Date().toLocaleDateString("en-US",date_opts);

    //renders list.ejs in views dir.  2nd arguement is list object
    res.render('list', {day_of_wk,new_items});
}

function post_action(req, res){
    let new_item = req.body.item;
    new_items.push(new_item);
    console.log(new_item);
    res.redirect("/");
}