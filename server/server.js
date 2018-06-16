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

app.post('/todos', authenticate, (req, res) => {
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos})
    }, (e) => res.status(400).send(e));
});

app.get('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    } 

    try {
        const todo = await Todo.findOne({
                            _id: id,
                            _creator: req.user._id 
                        });
        if (!todo) {
            return res.status(404).send();            
        }
        res.send({todo});

    } catch(e) {
        res.status(400).send(e);
    }
});

app.delete('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    } 

    try {
        const todo = await Todo.findOneAndRemove({
                        _id: id,
                        _creator: req.user._id
                    });
        if (!res) {
            return res.status(404).send();
        }    
        res.send({todo});
    } catch(e) {
        res.status(400).send(e);
    }
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true})
        .then((todo) => {
            if (!res) {
                return res.status(404).send();
            }

            res.send({todo});
        }).catch((err) =>  {
            res.status(400).send(err);
        });
});

app.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const newUser = new User(body);
        await newUser.save();
        const token = await newUser.generateAuthToken();
        res.header('x-auth', token).send(newUser);
    } catch(e) {
        res.status(400).send(e);
    }
 });

app.post('/users/login', async (req, res) => {
    try {
        const user = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(user.email, user.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(400).send();
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch(e) {
        res.status(400).send()
    }
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
  
module.exports = {app};