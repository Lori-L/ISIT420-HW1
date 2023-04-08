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

/* Add 500 new Orders */
router.post('/AddOrders500', function(req, res) {
  const newOrders = req.body;  // get the object from the req object sent from browser
  console.log(newOrders[1]); // write the first order to console to verify that it was received

  newOrders.forEach(order => {
    ServerOrderArray.push(order);
  });
  fileManager.write();

  // prepare a reply to the browser
  var response = {
    status  : 200,
    success : 'Added Successfully'
  }
  res.end(JSON.stringify(response)); // send reply
});

module.exports = router;
