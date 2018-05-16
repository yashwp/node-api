const _ =  require('lodash');
const express =  require('express');
const bodyParser =  require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');


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

app.get('/todos/:id', (req, res) => {
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
        });
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    let body = _.pick(req.body, ['text', 'isCompleted']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.isCompleted) && body.isCompleted) {
        body.completedAt = new Date().getTime();
    } else {
        body.isCompleted = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
        .then((todo) => {
            if (!res) {
                return res.status(404).send();
            }

            res.send({todo});
        }).catch((err) =>  {
            res.status(400).send(err);
        });
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let newUser = new User(body);
 
    newUser.save().then(() => {
        return newUser.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
    let user = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(user.email, user.password)
        .then((user) => {
            return user.generateAuthToken().then((token) => {
                res.header('x-auth', token).send(user)
            })
        })
        .catch((err) => res.status(400).send());
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});
  
app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
  
module.exports = {app};