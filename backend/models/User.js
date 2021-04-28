const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {nanoid} = require("nanoid");
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator: async function(value) {
                if (this.isModified('username')) {
                    const user = await User.findOne({username:value});
                    return !user;
                }
                return true;
            },
            message: 'This user has already registered'
        }
    },
    password:{
        type:String,
        required:true,
    },
    token:{
        type:String,
    },
    role:{
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin'],
    }
});

UserSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});

UserSchema.set('toJSON',{
    transform:(doc, ret, options)=>{
        delete ret.password;
        return ret;
    }
});

UserSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    this.token = nanoid();
};

const User = mongoose.model('Users', UserSchema);
module.exports = User;