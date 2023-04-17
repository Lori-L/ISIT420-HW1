let x = 2;
var express = require('express');
var router = express.Router();
var fs = require("fs");

// start by creating data so we don't have to type it in each time
let ServerOrderArray = [];

// define a constructor to create order objects
let OrderObject = function (pStore, pSalesPerson, pCd, pPrice, pDate) {
  this.StoreID = pStore;  
  this.SalesPersonID = pSalesPerson;
  this.CdID = pCd;
  this.PricePaid = pPrice;
  this.Date = pDate;
}

// my file management code, embedded in an object
fileManager  = {

  // this will read a file and put the data in our order array
  // NOTE: both read and write files are synchonous, we really can't do anything
  // useful until they are done.  If they were async, we would have to use call backs.
  // functions really should take in the name of a file to be more generally useful
  read: function() {
    const stat = fs.statSync('ordersData.json');                       
    var rawdata = fs.readFileSync('ordersData.json'); // read disk file
    ServerOrderArray = JSON.parse(rawdata);  // turn the file data into JSON format and overwrite our array
  },
  
  write: function() {
    let data = JSON.stringify(ServerOrderArray);    // take our object data and make it writeable
    fs.writeFileSync('ordersData.json', data);  // write it
  },
}

// add mongoDB support  ===============================

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const OrderSchema = require("../orderSchema");


// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection is in (MoviesDB)
const dbURI =
 "mongodb+srv://loriuser:MongoDBPassword@loricluster.d4zi0le.mongodb.net/isit420?retryWrites=true&w=majority";
  // Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);


//============================================


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});


/* Add one new Order */
router.post('/AddOrder', function(req, res) {
  const newOrder = req.body;  // get the object from the req object sent from browser
  console.log(newOrder); // write the object to console to verify that it was received

  //Does not write to the json file because of the instructions:
  //"Do not store these '1 of' objects in a file on the server"
  //ServerOrderArray.push(newOrder); 
  //fileManager.write();

  // prepare a reply to the browser
  var response = {
    status  : 200,
    success : 'Received Successfully'
  }
  res.end(JSON.stringify(response)); // send reply
});

/* Adds 500 new Orders to MongoDB */
router.post('/AddOrders500', function(req, res) {
  const newOrders = req.body;
  console.log(newOrders[1]);


  newOrders.forEach(order => {
    let oneNewOrder = new OrderSchema(order);  
    oneNewOrder.save((err, todo) => {
      if (err) {
        res.status(500).send(err);
      }
      else {
      // console.log(todo);
      // res.status(201).json(todo);

      var response = {
        status  : 200,
        success : 'Added Successfully'
      }
      res.end(JSON.stringify(response)); // send reply

      }
    });
  });
});

//Finds total money eanred, sorted by sales representative
//To find which reps are doing well and which ones aren't
router.get('/getMoneyBySalesRep', function(req, res) {
  OrderSchema.aggregate([
    {
      $match: {SalesPersonID: { $gt: 0, $lt: 25}}
    },

    {
      $group: {
        _id: "$SalesPersonID",
        totalPrice: {$sum: "$PricePaid"}
      }
    },
    
    {
      $sort: {totalPrice: -1}
    }
  ]).exec(function(err, AllOrders) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(AllOrders);
    res.status(200).json(AllOrders);
  });
});

//Finds total money from each CD.
//To find which CDs are popular / unpopular
router.get('/getSaleNumbersPerCd', function(req, res) {
  OrderSchema.aggregate([
    {
      $match: {CdID: { $gt: 0, $lt: 654322}}
    },

    {
      $group: {
        _id: "$CdID",
        totalPrice: {$sum: "$PricePaid"}
      }
    },
    
    {
      $sort: {totalPrice: -1}
    }
  ]).exec(function(err, AllOrders) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(AllOrders);
    res.status(200).json(AllOrders);
  });
});

module.exports = router;
