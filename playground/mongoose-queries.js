const {mongoose} = require('./../server/db/mongoose');
const {User} = require('./../server/models/user');

const id = '5af1b4833e3106027c2082d0';

// Todo.find({
//     _id: id
// }).then((todos) => console.log(todos));

// Todo.findOne({
//     _id: id
// }).then((todos) => console.log(todos));


// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('No such id');
//     }
//     console.log(todos)
// }).catch((err) => console.log('err'))

User.findById(id).then((user) => {
    if (!user) {
        return console.log('No such id');
    }
    console.log(user);
}).catch((e) => console.log(`Err ${err}`));