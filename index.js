const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
// app.use(cors());
// const corsConfig = {
//     origin: '*',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))
const corsOptions ={
    origin:'*', 
    credentials:true,
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions))

 
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vrpqnh1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)


        const allToyCollection = client.db('toyhouse').collection('allToy')

        app.get('/allToy', async (req, res) => {
            const cursor = allToyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/allToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allToyCollection.findOne(query)
            res.send(result);
        })


        app.get('/allToy/:email', async (req, res) => {
            console.log(req.query);
            const email = req.params.email;
            console.log(email);
            const result = await allToyCollection.find().toArray();
            res.send(result);
        })


        app.get('/allToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allToyCollection.findOne(query)
            res.send(result);
        })


        app.put('/allToy/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedToy = req.body;
            const utoy = {
                $set: {
                    category: updatedToy.category,
                    detail: updatedToy.detail,
                    photo: updatedToy.photo,
                    quantity: updatedToy.quantity,
                    rating: updatedToy.rating,
                    SellerEmail: updatedToy.SellerEmail,
                    sellerImg: updatedToy.sellerImg,
                    toyName: updatedToy.toyName
                }

            }
            const result = await allToyCollection.updateOne(filter, utoy, options)
        })


        app.post('/allToy', async (req, res) => {
            const newToy = req.body;
            console.log(newToy);
            const result = await allToyCollection.insertOne(newToy);
            res.send(result);
        })

        app.delete('/allToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allToyCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('TOY World Server is Running')
})



app.listen(port, () => {
    console.log(`Toy World Server is Running on port ${port}`);
})