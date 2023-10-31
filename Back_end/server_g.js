const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000

app.use(cors())
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World! Let\'s Working with NoSQL Databases')
})


const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017/";
const connectDB = async () => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log(`MongoDB connected successfully.`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
connectDB();


// Read All API
app.get('/data', async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('admin').collection('long')
        .find({}).sort({ "Date received": -1 }).limit(100000).toArray();

    await client.close();
    res.status(200).send(objects);
})

// Create API
app.post('/data/create', async (req, res) => {
    const object = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('admin').collection('long').insertOne({
        key: object.VALUE
    });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Object is created",
        "object": object
    });
})

// Update API
const { ObjectId } = require('mongodb')
app.put('/data/update', async (req, res) => {
    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('admin').collection('long').updateOne({ '_id': ObjectId(id) }, { "$set": { key: object.VALUE } });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Object with ID = "+ id  + "is updated",
        "object": object
    });
})

// Delete API
app.delete('/data/delete', async(req, res) => {
    const id = req.body._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('admin').collection('long').deleteOne({'_id': ObjectId(id)});
    await client.close();
    res.status(200).send({
    "status": "ok",
    "message": "Object with ID = " + id + " is deleted"});
    })

// Read by id API
app.get('/data/:id', async (req, res) => {
    const id = req.params.id;
    const client = new MongoClient(uri);
    await client.connect();
    const user = await client.db('admin').collection('long').findOne({ "_id": ObjectId(id) });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Complaint with ID = " + id + " is deleted",
        "object":user
    });
})

// Read by id API
app.get('/data/findtext/:searchText', async (req, res) => {
    const { params } = req;
    const searchText = params.searchText
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('admin').collection('long').find({ $text: { $search: searchText } }).sort({ "FIELD": -1 }).limit(100000).toArray();

    await client.close();
    res.status(200).send({
        "status": "ok",
        "searchText": searchText,
        "data": objects
    });
})


// Query by filter API: Search text from Product Name
app.get('/data/product/:searchText', async (req, res) => {
    const { params } = req;
    const searchText = params.searchText
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('admin').collection('long').find({ $text: { $search: searchText } }).sort({ "Date received": -1 }).limit(100000).toArray();
    await client.close();
    res.status(200).send({
        "status": "ok",
        "searchText": searchText,
        "Complaint": objects
    }); 
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



