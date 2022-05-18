
/* -------node.js app boilerplate--------*/

//Server setup
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
const PORT = 3000;

/* ------------Database Setup ------------*/
const DB_PORT = 27017;
const DB_URI = "mongodb://localhost:" + DB_PORT + "/todoDB";
mongoose.connect(DB_URI);

//create schema and model
const taskSchema = new mongoose.Schema({
    name: String
});
const Task = mongoose.model("Task", taskSchema);
var currentTasks = [];

/* --------------Server Logic --------*/

//Start server listing on port
app.listen(PORT, function () {
    console.log("Web server running on port " + PORT);
});

app.get("/", response);
app.post("/", post_root);
app.post("/delete", post_delete);
app.get("/about", function (req, res) {
    res.render("about");
});

//Response function for root dir
function response(req, res) {
    var date_opts = {
        weekday: "long",
        day: 'numeric',
        month: 'long'
    };
    var day_of_wk = new Date().toLocaleDateString("en-US", date_opts);

    Task.find({}, function (err, data) {
        if (data.length == 0) {
            currentTasks = addDefaultTask();
            res.redirect("/");
        } else {
            currentTasks = data;
            console.log(currentTasks);
            res.render('list', { day_of_wk: day_of_wk, listTitle: "Today", tasks: currentTasks });
        }
    });
}

//Post function for root dir
function post_root(req, res) {
    let new_item = req.body.item;
    const task = new Task({
        name: new_item
    });
    task.save();
    res.redirect("/");
}

//handle item deletions
function post_delete(req, res) {
    Task.deleteOne({_id:req.body.checkbox}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Deleted item: " + req.body.checkbox + );
        }
    })
    res.redirect("/");
}

function addDefaultTask(){
    const defaultTask = new Task({
        name: "Update tasks"
    });

    Task.insertMany(defaultTask, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Created default item");
        }
    });
}