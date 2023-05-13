const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.eepi0pq.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const serviseData = client.db("servisedb");
        const servises = serviseData.collection("servise");
        const coffieHouse = client.db("coffieHouse")
        const newcoffie = coffieHouse.collection("our servises")
        app.get('/servises',async(req,res)=>{
            const coursor =  newcoffie.find()
            const result = await coursor.toArray()
            res.send(result)
        })

        app.get('/coffie/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await servises.findOne(query);
            res.send(result)
        })

        app.get('/coffie',async(req,res)=>{
            const coursor =servises.find()
            const result = await coursor.toArray()
            res.send(result)
        })

        app.post('/coffie', async (req, res) => {
            const newProducts = req.body
            const result = await servises.insertOne(newProducts);
            res.send(result)
        })

        app.put('/updateCoffie/:id',async(req,res)=>{
            const id = req.params.id
            const filter = {_id: new ObjectId(id)}
            const option = {upsert:true}
            const updatedCoffee = req.body
            const coffee = {
                $set:{
                    chef:updatedCoffee.chef,
                    supplier:updatedCoffee.supplier,
                    category:updatedCoffee.category,
                    imgUrl:updatedCoffee.imgUrl
                }
                
            }
            const result = await servises.updateOne(filter,coffee, option)
            res.send(result)
        })

        app.delete('/coffie/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await servises.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('vai kaj running coltese pera nio na')
})

app.listen(port, () => {
    console.log(`coffie is running in port ${port}`)
})

