const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {User} = require('./../server/models/user');
const {Todo} = require('./../server/models/todo');

// User.remove({}).then((res) => console.log(res))
// .catch((err) => console.log(err));


Todo.findByIdAndRemove('5af1a8879d702d3ba854ab5f')
    .then((res) => {
        if (!res) {
            return console.log('Invalid ID');
        }

        console.log(`Deleted todo is ${res}`);
}).catch((err) => console.log('Unable to delete todo'));
