const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://webcam:webcam@cluster0.pizmgb2.mongodb.net/?retryWrites=true&w=majority";

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

    // Send a ping to confirm a successful connection

    const db = client.db("webcam");
    //await client.db("webcam").command({ ping: 1 });
    await db.command({ ping: 1 });

    console.log("ping");
    await db.collection("webcam").find({id: {$lt: 2000}}).toArray((error,documents)=>{
        console.log("start");
        for (var document of documents){
            console.log("ok");
            console.log(document.id);
        }
    });

    console.log("pong");
    const result = db.collection("webcam").aggregate(
      [
        { $group: { _id: "$id", count: { $sum: 1 },max: { $max: "$id"}} }
      ]
    ).toArray((err, result) => {
      console.log("result");
      if (err) {
        throw err;
      }
      console.log(result);
    });
    

    console.log(result.result);

  } finally {
    // Ensures that the client will close when you finish/error
    //
    //await client.close();
  }

}

run().catch(console.dir);
