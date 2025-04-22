const express = require('express');
const cors = require('cors');
const app = express();
const port =  process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware

app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.56yvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// const userCollection = client.db('academixDb').collection('Users');

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

      // ! database collections
      const  userCollections = client.db('go-marathon-db').collection('Users')
      const  marathonCollections = client.db('go-marathon-db').collection('Marathons')
      const  registerdMarathonCollections = client.db('go-marathon-db').collection('Registerd-Marathons')




//      !user related api
      //  creat new user
app.post('/api/users', async(req,res) => {
           try {
              const newUser = req.body;
              const email = newUser.email;

            
              

                  // varify user 
                    if(!email){
                         return res.status(400).json({success : false , message : 'email is required'})
                    }

                  //     if user already exist in database 
                    const existingUser = await userCollections.findOne({email});

                    if(existingUser){
                         return res.status(200).json({success : true , message : 'user already exist'})
                    }

              const result = await userCollections.insertOne(newUser);
                       res.send(result)
           } catch (error) {
              res.status(500).json({
                   success : false,
                   message : 'Faild to creat user',
                   error : error.message
              })
           }
})

            // get all users

app.get('/api/users', async (req, res) => {
      try {
        const result = await userCollections.find().toArray();
          res.send(result)
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch users',
          error: error.message,
        });
      }
    });

// ! marathon related api
    app.post('/api/marathon' , async(req,res) => {
             const  marathonData = req.body;

             const result = await marathonCollections.insertOne(marathonData);
             res.send(result)
    })

    app.get('/api/marathon', async(req,res) => {
           const result = await marathonCollections.find().toArray();
           res.send(result);
    })

    // delete single marathon

    app.delete('/api/marathon/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};

        const result = await marathonCollections.deleteOne(query);
        res.send(result)
    })

    // update marathon data
    app.patch('/api/marathon/:email', async (req,res) => {

      const email = req.params.email;
      const updatedMarathonData = req.body;

      const filter = {email : email};
      const updatedDoc = {
        $set : {
          marathonTitle :  updatedMarathonData.marathonTitle,
          registrationStart : updatedMarathonData.registrationStart,
          registrationEnd : updatedMarathonData.registrationEnd,
          marathonStart : updatedMarathonData.marathonStart,
          location : updatedMarathonData.location,
          runningDistance : updatedMarathonData.runningDistance,
          description : updatedMarathonData.description,
          marathonImage : updatedMarathonData.marathonImage
        }
      }

      const result = await marathonCollections.updateOne(filter,updatedDoc);
      res.send(result)
      
        
    })

//     ! registerd Marathon Collections related api

   app.post('/api/registerd-marathon', async(req,res) => {
        const data = req.body;
        const result = await registerdMarathonCollections.insertOne(data);
        res.send(result)
   })

   app.get('/api/registerd-marathon', async(req,res) => {
         const result = await registerdMarathonCollections.find().toArray();
         res.send(result)
   })






















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);





app.get('/', async(req,res) => {
      res.send('Go-Marathon Server Is Running ')
})


app.listen(port, ()  => {
      console.log('Go-Marathon Server Is Running. port :', port);
      
})