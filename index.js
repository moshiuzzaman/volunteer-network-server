const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ki0s6.mongodb.net/${process.env.DB_USER}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 4000





client.connect(err => {
  const opportunitiesCollection = client.db(`${process.env.DB_USER}`).collection("volenteerOpportunities");
  const volunteerCollection = client.db(`${process.env.DB_USER}`).collection("volunteer");
  app.get('/opportunities', (req, res) => {

    opportunitiesCollection.find({})
      .toArray((err, result) => res.send(result))
  })
  app.get('/opportuniti/:id', (req, res) => {
    const id = req.params.id
    opportunitiesCollection.find({ _id: ObjectID(id) })
      .toArray((err, result) => {
        res.send(result[0])
      })
  })
  app.post('/addVolunteerEvent', (req, res) => {
    volunteerCollection.insertOne(req.body)
      .then(result => res.send(result.insertedCount > 0))
  })
  app.get('/volunteerEvents', (req, res) => {
    const email = req.query.email
    volunteerCollection.find({ email: email })
      .toArray((err, result) => {
        res.send(result)
      })
  })
  app.delete('/cancleEvent/:id', (req, res) => {
    const id = req.params.id
    volunteerCollection.deleteOne({ _id: ObjectID(id) })
      .then(result => res.send(result.deletedCount > 0))
  })
app.delete('/deleteEvent/:id', (req, res) => {
    const id = req.params.id;
    opportunitiesCollection.deleteOne({ _id: ObjectID(id) })
      .then(result => res.send(result.deletedCount > 0))
  })

  app.get ('/registeredVolunteer',(req, res) => {
    volunteerCollection.find({})
    .toArray((err, result) =>{
      res.send(result)
    })
  })
  app.post('/addEvent',(req, res) => {
    opportunitiesCollection.insertOne(req.body)
    .then(result => res.send(result.insertedCount>0))
  })
  app.get('/events',(req, res) => {
    const searchvalue=req.query.filter
    opportunitiesCollection.find({title: {$regex: searchvalue}})
    .toArray((err, result) =>{
      res.send(result)
    })
  })
  app.get('/event',(req, res) => {
    const eventTitle=req.query.title
    volunteerCollection.find({title: eventTitle})
    .toArray((err, result) => {
      res.send(result)
    })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT||port, () => {
  console.log(`${port} is running`)
})