//Set up mongoose connection
const mongoose = require("mongoose");

// const mongoDB = 'mongodb://localhost/node_rest_api';
// const mongoDB = `mongodb+srv://admin:admin123@cluster0-cbxbu.mongodb.net/test?retryWrites=true&w=majority`;

// sushants personal
const mongoDB = "mongodb+srv://neosoft:neosoft@cluster0.ccimr.mongodb.net/champion?retryWrites=true&w=majority"; 
mongoose
  .connect(process.env.MONGODB, { useNewUrlParser: true })
  .then((res) => {
    console.log("db connected ");
  })
  .catch((err) => console.log(err));
mongoose.Promise = global.Promise;
module.exports = mongoose;
