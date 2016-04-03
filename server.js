//require modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var handlebars = require('express-handlebars')
    .create({defaultLayout: 'main'});

//instantiate express()
var app = express();


//configure handlebars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


//set static folder
//app.use(express.static('./static'));


//use and configure bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//connect database, configure schema, set model
mongoose.connect('mongodb://localhost/movies');
var movieSchema = mongoose.Schema({
    title: String,
    actor: String
});
var Movie = mongoose.model('Movie', movieSchema);


//instantiate express.Router()
var movieRouter = express.Router();


//set routes
movieRouter.route('/')
    .get(function(req, res) {
        Movie.find(function(err, movies) {
            if(err) res.send(err);
            res.render('one');
            //res.json(movies);
        })
    })
    .post(function(req, res) {
        var movie = new Movie({
            title: req.body.title,
            actor: req.body.actor
        });
        movie.save(function(err, movie) {
            if(err) res.send(err);
            res.json(movie);
        })
    });


movieRouter.route('/:id')
    .get(function(req, res) {
        Movie.findById(req.params.id, function(err, movie) {
            if(err) res.send(err);
            res.json(movie);
        })
    })
    .put(function(req, res) {
        Movie.findById(req.params.id, function(err, movie) {
            if(err) res.send(err);
            movie.title = req.body.title;
            movie.actor = req.body.actor;
            movie.save(function(err, movie) {
                if(err) res.send(err);
                res.json(movie);
            })
        })
    })
    .delete(function(req, res) {
        Movie.findByIdAndRemove(req.params.id, function(err, movie) {
            res.json(movie);
        })
    });

//set routes prefix
app.use('/api', movieRouter);


//set server port
app.listen(3000, function() {
    console.log('the server is listening on port 3000.');
});
