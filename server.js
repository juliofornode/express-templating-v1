//require modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


//instantiate express()
var app = express();


//use and configure bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json);


//connect database, configure schema, set model
mongoose.connect('mongodb://localhost/routing-v1');
var itemSchema = mongoose.Schema({
    name: String,
    lastName: String
});
var Item = mongoose.model('Item', itemSchema);


//instantiate express.Router()
var itemRouter = express.Router();


//set routes
itemRouter.route('/items')
    .get(function(req,res) {
        Item.find(function(err, items) {
            if(err) res.send(err);
            res.json(items);
        })
    })
    .post(function(req, res) {
        var item = new Item({
            name: req.body.name,
            lastName: req.body.lastName
        });
        item.save(function(err, item) {
            if(err) res.send(err);
            res.json(item);
        })
    });


itemRouter.route('/items/:id')
    .get(function(req, res) {
        Item.findById(req.params.id, function(err, item) {
            if(err) res.send(err);
            res.json(item);
        })
    })
    .put(function(req, res) {
        Item.findById(req.params.id, function(err, item) {
            if(err) res.send(err);
            item.name = req.body.name;
            item.lastName = req.body.lastName;
            item.save(function(err, item) {
                if(err) res.send(err);
                res.json(item);
            })
        })
    })
    .delete(function(req, res) {
        Item.findByIdAndRemove(req.body.id, function(err, item) {
            res.json(item);
        })
    });

//set routes prefix
app.use('/api', itemRouter);


//set server port
app.listen(3000, function() {
    console.log('the server is listening on port 3000.');
});
