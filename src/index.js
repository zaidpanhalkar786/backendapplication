require('./models/User');
require('./models/Track');
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();
app.use(cors("*"));
app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

//const mongoUri = "mongodb+srv://azureuser:india@123@cluster0.egb4t.azure.mongodb.net/trackServer?retryWrites=true&w=majority";
const mongoUri = "mongodb+srv://zaidpanhalkar786:ZxpBFEFEBSz4BDef@cluster0.mijeqiy.mongodb.net/trackServer?retryWrites=true&w=majority";
if (!mongoUri) {
  throw new Error(
    `MongoURI was not supplied.  Make sure you watch the video on setting up Mongo DB!`
  );
}
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true
});
mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
});
mongoose.connection.on('error', err => {
  console.error('Error connecting to mongo', err);
});

app.get('/', requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

app.listen(3001, () => {
  console.log('Listening on port 3002');
});