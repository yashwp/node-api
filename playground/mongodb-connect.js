// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log(`Unable to connect mongoDB`);
    }
    console.log(`Connected successfully`);
    let db = client.db('TodoApp');
    // db.collection('Todos').insertOne({
    //     text: 'Someting to do',
    //     isCompleted: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert', err);
    //     }
    //     console.log(`Inserted successfully`, JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Harsh',
    //     age: 21,
    //     Address: '221B Baker streets'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert', err);            
    //     }
    //     console.log(`User created successfully`, JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));        
    // });

    client.close();
});