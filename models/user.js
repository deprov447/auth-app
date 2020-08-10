var mongoose=require("mongoose");
var passportLocalMongoose =require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
    username: String,
    password: String
})

userSchema.plugin(passportLocalMongoose);
var user =  mongoose.model("User",userSchema);

module.exports= user;