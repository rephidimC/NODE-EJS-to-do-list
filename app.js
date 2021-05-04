//jshint esversion:6
const express= require("express");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");
const https = require("https");
const bodyParser = require("body-parser");
//Below is requiring a local js file that houses jS function for date.
const date = require(__dirname + "/views/date.js");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://RephidimC:Developer2019!@cluster0.0qqta.mongodb.net/toDolistDB?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});

var dateToday = date.getDay();

const itemsSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: [true, "Why no name?"]
  },
});

const listSchema = new mongoose.Schema ({
  name: String,
  items: [itemsSchema]
})

const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);

const item4 = new Item ({
  name: "Watch Football"
});

const item5 = new Item ({
  name: "Barb my Hair"
});

const item6 = new Item ({
  name: "Eat"
});

const defaultItems = [item4, item5, item6];

// Item.insertMany(defaultItems, function(err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Successfully saved all the items");
//   }
// });



app.get("/", function(req, res){

  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved all the items");
        }
      });
      res.redirect("/");
    } else {
      var dateToday = date.getDay();
      res.render('index', {listTitle: dateToday, newItem: foundItems});
    }
  });
  // You see from down here, codes that are normally not related to app routes should normally not be in here, as they should be in a seperate file and be required here, bso what to do is to create an external js file and push them in there.
  // var today = new Date();
  // var options = {
  //   weekday: 'long',
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric'
  // };
  //
  // var dateToday= today.toLocaleDateString("en-US", options);

  // the below works in a situation where there is only one function in the date.js,
  // but now when we have two functions, we can tap into them differently, how? Below

  // var dateToday = date();



  // the above works in a situation where there is only one function in the date.js,
  // but now when we have two functions, we can tap into them differently, how? Below


});

app.get("/:customListName", function(req, res) {
  var requestedPage = req.params.customListName;
  requestedPage = requestedPage.replace(" ", "-").toLowerCase();
  console.log(requestedPage);

  List.findOne({ name: requestedPage}, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        console.log("Doesn't exist");
        //create a new list then since it didn't exist before now
        const list = new List({
          name: requestedPage,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + requestedPage);
      }
      else {
        console.log("Exists");
        //simply render the found list
        res.render('index', {listTitle: foundList.name, newItem: foundList.items});
      }
    }
  });





  // posts.forEach(function(post) {
  // var storedTitle = post.title;
  // var storedBody = post.body;
  //
  // storedTitle = storedTitle.replace(" ", "-").toLowerCase();
  // // console.log(storedTitle);
  //
  //   if (requestedTitle === storedTitle) {
  //     res.render("post", {Title: post.title, Body: storedBody});
  //  }
  //   else {
  //    res.render("post", {Title: "Error 404!", Body: "Page Not found"});
  //   }
  // });
});

app.post("/", function(req,res) {
  var newAddition = req.body.new;
  const listName = req.body.list;

  var item = new Item ({
    name : newAddition
  });

  if (listName === dateToday) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name : listName}, function(err, foundList) {
      foundList.items.push(item);
      //the above line of code is coming from the array above
      // const listSchema = new mongoose.Schema ({
      //   name: String,
      //   items: [itemsSchema]
      // })
      foundList.save();
      res.redirect("/" + listName)
    });
  }
});



app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  console.log(checkedItemId);
  const listName = req.body.listName;

  if (listName === dateToday) {
    Item.findByIdAndRemove(checkedItemId, function(err, doc) {
      if (!err) {
            console.log(doc);
            res.redirect("/");
          }
          else {
            console.log(err);
          }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }



});

// app.post("/:customListName", function(req,res) {
//   var newAddition = req.body.new;
//
//   var item = new Item ({
//     name : newAddition
//   });
//   item.save();
//   res.redirect("/:customListName");
// });

// app.get("/:customListName", function(req, res) {
//   var requestedPage = req.params.customListName;
//   requestedPage = requestedPage.replace(" ", "-").toLowerCase();
//   console.log(requestedPage);
//
//   List.findOne({ name: requestedPage}, function(err, foundList) {
//     if (!err) {
//       if (!foundList) {
//         console.log("Doesn't exist");
//         //create a new list then since it didn't exist before now
//         const list = new List({
//           name: requestedPage,
//           items: defaultItems
//         });
//
//         list.save();
//
//         res.redirect("/" + requestedPage);
//       }
//       else {
//         console.log("Exists");
//         //simply render the found list
//         res.render('index', {listTitle: foundList.name, newItem: foundList.items});
//       }
//     }
//   });

app.get("/about", function(req,res){
  res.render("about");
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(res, req) {
  console.log("Server has started successfully");
});
