const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: { type: String, required: true },
    hash: { type: String, required: true }
}
)

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);