const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    passwordHash: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note"
        }
    ]

})

userSchema.set("toJSON", {
    transform: (document, object) => {
        // console.log(object._id.toString());
        object.id = object._id.toString();
        ["_id", "__v", "passwordHash"].forEach(key=>delete object[key])
    }
})

const User = mongoose.model("User", userSchema)


module.exports = User