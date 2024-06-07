const mongoose = require("mongoose");

// mongoose.connect("mongodb+srv://riteshsonawane622:AzdFvGn7Oqh3fS0G@cluster0.uimcfvu.mongodb.net/paytm");


const connectDB = async () => {
    try {
            
        const connectionInstance = await mongoose.connect(`mongodb+srv://riteshsonawane622:AzdFvGn7Oqh3fS0G@cluster0.uimcfvu.mongodb.net/paytm`);
        console.log(`\n mongoDB connected !! DB Host :${connectionInstance.connection.host}`);

    } catch (error) {
        
        console.log("MONGODB CONNECTION ERROR", error);
        process.exit(1);
    }
}




const userSchema = mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
})

const accountSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: { 
        type: Number,
        required: true
    },
})

const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User", userSchema);

// export default connectDB;

module.exports = {
    User,
    Account,
    connectDB
}
