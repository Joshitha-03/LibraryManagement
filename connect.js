const mongoose=require("mongoose");
mongoose.set("strictQuery",true);

async function connectDb() {
    return mongoose.connect("mongodb://localhost:27017/library");    
}
module.exports=connectDb;