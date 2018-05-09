// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log(`Unable to connect mongoDB`);
    }
    console.log(`Connected successfully`);
    let db = client.db('TodoApp');

    // Delete Many
    // db.collection('Users').deleteMany({name: 'Yash'})
    //     .then((result) => {
    //         console.log(result)
    //     });

    // Delete One
    // db.collection('Users').deleteOne({name: 'Harsh'})
    //     .then((result) => {
    //         console.log(result)
    //     });

    // findOneAndDelete
    db.collection('Todos').findOneAndDelete({isCompleted: true})
        .then((result) => {
            console.log(result)
        });
    // client.close();
});