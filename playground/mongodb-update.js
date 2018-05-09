// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log(`Unable to connect mongoDB`);
    }
    console.log(`Connected successfully`);
    let db = client.db('TodoApp');

    // findOneAndUpdate
    db.collection('Users').findOneAndUpdate({
        _id: ObjectID('5af18d300ccf946185900f1e')
    },{
        $set: {
            name: 'Vicky'
        },
        $inc: {
            age: -2
        }
    }, {
        returnOriginal: false
    })
        .then((result) => {
            console.log(result)
        });
    // client.close();
});