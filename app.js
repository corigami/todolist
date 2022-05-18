
/* -------node.js app boilerplate--------*/

//Server setup
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
var PORT = 3000;
var new_items = ['Thing 1', 'Thing 2', 'Thing 3'];    //initial starting tasks

//Start server listing on port
app.listen(PORT, function () {
    console.log("Web server running on port " + PORT);
});

app.get("/", response);
app.post("/", post_action);

app.get("/about", function(req,res){
    res.render("about");
});

//Response function for root dir
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

//Post function for root dir
function post_action(req, res){
    let new_item = req.body.item;
    new_items.push(new_item);
    console.log(new_item);
    res.redirect("/");
}