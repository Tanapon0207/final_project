const express = require('express')
const cors = require('cors')
var bodyParse = require("body-parser");
const app = express()
const e = require("express");
var mongoose = require("mongoose");
const port = 3500
app.use(cors())

app.use(express.json());


app.use(bodyParse.json())
app.use(express.static('../Front_end'))
app.use(bodyParse.urlencoded({
    extended: true
}))


mongoose.connect('mongodb://127.0.0.1:27017/admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var db = mongoose.connection;

// check connect

db.on('error', () => console.log("error in connecting database"));
db.once('open', () => console.log("Connected to Database"));



app.get("/", (req, res) => {

    res.set({
        "Allow-access-Allow-Origin": '*'
    })

    return res.redirect('login.html');

});

app.post("/register", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var position = req.body.position;
    
    var data = {
        "username": username,
        "password": password,
        "position": position
        
    }
    db.collection('data').insertOne(data, (err, collection) => {
        if (err) throw err;
        console.log("Record Inserted Successfully");
    });
    return res.redirect('signup_s.html');

});

app.post("/login", async (request, response) => {
    try {
        //adding
        const username = request.body.username;
        const password = request.body.password;

        const usermail = db.collection('data').findOne({ username: username }, (err, res) => {
            if (res == null) {
                
                //return response.redirect('sign_up.html');
                return response.redirect('sign_up.html');
                
            }
            else if (err) throw err;


            if (res.password === password) {
                //return response.redirect('login_s.html');
                return response.redirect('graph.html');
                
            }
            else {
                return response.redirect('login_f.html');
            }


        });
    }
    catch (error) {
        return response.redirect('login_f.html');
    }



});


const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017/admin";
const connectDB = async() => {
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
app.get('/complaints', async(req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('admin').collection('data')
        .find({}).limit(4378).toArray();

    await client.close();
    res.status(200).send(objects);
    
})


// Create API
app.post('/complaints/create', async(req, res) => {
    const object = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('admin').collection('data').insertOne({
        id: parseInt(object.id),
        "username": object.username,
        "password": object.password,
        "position": object.position
        
       
    });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Object is created",
        "object": object
    });
})




const { ObjectId } = require('mongodb')
app.put('/complaints/update', async(req, res) => {
    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('admin').collection('data').updateOne({ '_id': ObjectId(id) }, {
        "$set": {
        "_id": ObjectId(id),
        "username": object.username,
        "password": object.password,
        "position": object.position,
        }
    });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Object with ID = " + id + " is updated",
        "object": object
    });
})


// Delete API
app.delete('/complaints/delete', async(req, res) => {
    const id = req.body._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('admin').collection('data').deleteOne({ '_id': ObjectId(id) });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Object with ID = " + id + " is deleted"
    });
})


// Read by id API
app.get('/complaints/:id', async(req, res) => {
    const id = req.params.id;
    const client = new MongoClient(uri);
    await client.connect();
    const user = await client.db('admin').collection('data').findOne({ "_id": ObjectId(id) });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Complaint with ID = " + id + " is deleted",
        "object": user
    });
})



// Read by id API
app.get('/complaints/findtext/:searchText', async(req, res) => {
    const { params } = req;
    const searchText = params.searchText
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('admin').collection('data').find({ $text: { $search: searchText } }).sort({ "FIELD": -1 }).limit(4378).toArray();
    await client.close();
    res.status(200).send({
        "status": "ok",
        "searchText": searchText,
        "Complaints": objects
    });
})

// Query by filter API: Search text from Product Name
app.get('/complaints/Make/:searchText', async(req, res) => {
    const { params } = req;
    const searchText = params.searchText
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('admin').collection('data').find({ $text: { $search: searchText } }).sort({ "Date received": -1 }).limit(4378).toArray();
    await client.close();
    res.status(200).send({
        "status": "ok",
        "searchText": searchText,
        "Complaint": objects
    });
});


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