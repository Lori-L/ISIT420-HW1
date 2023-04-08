let x = 2;
var express = require('express');
var router = express.Router();
var fs = require("fs");

// start by creating data so we don't have to type it in each time
let ServerMovieArray = [];

// define a constructor to create movie objects
let MovieObject = function (pTitle, pYear, pGenre, pMan, pWoman, pURL) {
    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
    this.Title = pTitle;
    this.Year = pYear;
    this.Genre = pGenre;  // action  comedy  drama  horrow scifi  musical  western
}

// my file management code, embedded in an object
fileManager  = {

  // this will read a file and put the data in our movie array
  // NOTE: both read and write files are synchonous, we really can't do anything
  // useful until they are done.  If they were async, we would have to use call backs.
  // functions really should take in the name of a file to be more generally useful
  read: function() {
    // has extra code to add 4 movies if and only if the file is empty
    const stat = fs.statSync('moviesData.json');
    if (stat.size !== 0) {                           
    var rawdata = fs.readFileSync('moviesData.json'); // read disk file
    ServerMovieArray = JSON.parse(rawdata);  // turn the file data into JSON format and overwrite our array
    }
    else {
      // make up 3 for testing
      ServerMovieArray.push(new MovieObject("Moonstruck", 1981, "Drama"));
      ServerMovieArray.push(new MovieObject("Wild At Heart", 1982, "Drama"));
      ServerMovieArray.push(new MovieObject("Raising Arizona", 1983, "Comedy"));
      ServerMovieArray.push(new MovieObject("USS Indianapolis", 2016, "Drama"));
      fileManager.write();
    }
  },
  
  write: function() {
    let data = JSON.stringify(ServerMovieArray);    // take our object data and make it writeable
    fs.writeFileSync('moviesData.json', data);  // write it
  },
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* GET all Movie data */
router.get('/getAllMovies', function(req, res) {
  fileManager.read();
  res.status(200).json(ServerMovieArray);
});


/* Add one new Movie */
router.post('/AddMovie', function(req, res) {
  const newMovie = req.body;  // get the object from the req object sent from browser
  console.log(newMovie);
  ServerMovieArray.push(newMovie);  // add it to our "DB"  (array)
  fileManager.write();
  // prepare a reply to the browser
  var response = {
    status  : 200,
    success : 'Added Successfully'
  }
  res.end(JSON.stringify(response)); // send reply
});

// delete movie

router.delete('/DeleteMovie/:ID', (req, res) => {
  const ID = req.params.ID;
  let found = false;
  console.log(ID);    

  for(var i = 0; i < ServerMovieArray.length; i++) // find the match
  {
      if(ServerMovieArray[i].ID === ID){
        ServerMovieArray.splice(i,1);  // remove object from array
          found = true;
          fileManager.write();
          break;
      }
  }

  if (!found) {
    console.log("not found");
    return res.status(500).json({
      status: "error"
    });
  } else {
    var response = {
      status  : 200,
      success : 'Movie ' + ID + ' deleted!'
    }
    res.end(JSON.stringify(response)); // send reply
  }
});


module.exports = router;
