// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log(`Unable to connect mongoDB`);
    }
    console.log(`Connected successfully`);
    let db = client.db('TodoApp');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5aefebda311d8d1b5096be69')
    // }).toArray()
    //     .then((docs) => {
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, (err) => console.log(`Unable to fetch todos ${err}`))

    db.collection('Users').find({
        name: 'Harsh'
    }).count()
        .then((count) => {
            console.log(`Total count ${count}`);
        }, (err) => console.log(`Unable to fetch todos ${err}`))

    // client.close();
});