
/* -------node.js app boilerplate--------*/

//npm modules
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

//configure Express server
const app = express();
const PORT = 3000;                                      //3000 for testing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

//Start server listing
app.listen(PORT, function () {
    console.log("Web server running on port " + PORT);
});

/* ---------------Database Setup ------------*/
const DB_PORT = 27017;
const DB_URI = "mongodb://localhost:" + DB_PORT + "/todoDB";
mongoose.connect(DB_URI);

//create task schema and model
const taskSchema = new mongoose.Schema({name: String });
const Task = mongoose.model("Task", taskSchema);

//create list schema and model
const listSchema = new mongoose.Schema({listName: String, tasks: [taskSchema] });
const List = mongoose.model("List", listSchema);

/* --------------------Routes ---------------*/

app.get("/", function (req, res) {
    Task.find({}, function (err, data) {
        if (data.length == 0) {
            console.log("No Task Data Found");
            const task = new Task({name: "Update tasks"});

            Task.insertMany(task, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Created default item");
                }
            });
            res.redirect("/");
        } else {
            res.render('list', { date: getDayOfWeek(), title: "Today", tasks: data });
        }
    });
});

app.post("/", function (req, res) {
    const itemName = req.body.item;                     //req.body comes from the form submission
    const listName = req.body.list;
    const task = new Task({name: itemName});

    if (listName === "Today") {                         //if list is "Today" redirect to root
        task.save();
        res.redirect("/");
    } else {                                            //if list is custom redirect back to custom
        List.findOne({ name: listName }, function (err, data) {
            data.tasks.push(task);
            data.save();
            res.redirect("/" + listName)
        });
    }
});

app.get("/:listName", function (req, res) {
    const listName = _.capitalize(req.params.listName);                       //req.params comes from the url
    
    List.findOne({ name: listName }, function (err, data) {
        if (!err) {
            if (!data) { 
                //create default item and reload custom list           
                const task = new Task({name: "Update tasks"});
                const list = new List({name: listName, tasks:[task] });
                list.save();
                res.redirect("/" + listName);
            } else {
                res.render('list', { date: getDayOfWeek(), title: listName, tasks: data.tasks });
            }
        } else {                                    
            console.log(err);
        }
    })
});

app.post("/delete", function (req, res) {
    const listName = req.body.listName;             
    const itemId = req.body.checkbox;

    if (listName === "Today") {                             //delete from default list and redirect to root
        Task.findByIdAndRemove(itemId, function (err) {
            if (!err) {
                console.log("Deleted item: " + itemId);
                res.redirect("/");
            } else {                                    
                console.log(err);
            }
        });
    } else {                                                //delete from custom list and redirect to custom page
        List.findOneAndUpdate(
            { name: listName },                             //Condition to find
            { $pull: { tasks: { _id: itemId } } },          //MongoDb $pull function
            function (err, data) {
                if (!err) {
                    res.redirect("/" + listName);
                }
            }
        );
    }
});

app.get("/about", function (req, res) {
    res.render("about");
});

/*-------------Server functions-------------*/
function getDayOfWeek() {
    var date_opts = {
        weekday: "long",
        day: 'numeric',
        month: 'long'
    };
    var day_of_wk = new Date().toLocaleDateString("en-US", date_opts);
    return day_of_wk;
}