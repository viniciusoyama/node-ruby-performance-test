// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

// Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    console.log(cpuCount + "CPUS");

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    cluster.on('listening', function(worker) {
      console.log('Cluster %d conected', worker.process.pid);
    });

    cluster.on('disconnect', function(worker) {
      console.log('Cluster %d disconnected', worker.process.pid);
    });

    cluster.on('exit', function(worker) {
      console.log('Cluster %d falled off', worker.process.pid);
    });

// Code to run if we're in a worker process
} else {


// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Bear     = require('./models/bear');

mongoose.connect('mongodb://localhost/performance_test');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9292;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/bears')
  // get all the bears (accessed at GET http://localhost:8080/api/bears)
  .get(function(req, res) {
      Bear.find(function(err, bears) {
          if (err)
              res.send(err);

          res.json(bears);
      });
  })
  // create a bear (accessed at POST http://localhost:8080/api/bears)
  .post(function(req, res) {

      var bear = new Bear();      // create a new instance of the Bear model
      bear.name = req.body.name;  // set the bears name (comes from the request)

      // save the bear and check for errors
      bear.save(function(err) {
          if (err)
              res.send(err);

          res.json({ message: 'Bear created!' });
      });

  });
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

}
