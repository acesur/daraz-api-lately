//This file will handle database connection with MongoDb
const mongoose=require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/darazapp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connected to database successfully");
}).catch((e)=>{
    console.log("Error while connecting to database");
    console.log(e.toString());
});

//To prevent deprecation warning from MongoDb native driver
mongoose.set('useCreateIndex','true');
mongoose.set('useFindAndModify','false');

module.exports={mongoose};

