const express =  require('express');
const bodyParser =  require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (e) => res.status(400).send(e));
});

app.get('/todos/:id',(req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    } 

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();            
        }
        res.send({todo});
    }, (err) => res.status(400).send(err))
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    } 

    Todo.findByIdAndRemove(id)
        .then((todo) => {
            if (!res) {
                return res.status(404).send();
            }

            res.send({todo});
        }).catch((err) =>  {
            res.status(400).send(err);
            console.log(err);
        });
});

app.listen(port, () => console.log('Port ' + port));

module.exports = {app};