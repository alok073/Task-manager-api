const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./Task");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: false,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: [7, "Password length should be greater than 6"],
        validate(value) {
            if(validator.contains(value, "password")) {
                throw new Error("Your password should not contain the word password");
            }
        }
    },
    age: {
        type: Number,
        required: true,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error("Age cannot be a negative number.")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

//virtual property : tasks
userSchema.virtual("tasks", {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//generate a jwt against the user's ID
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET);
    this.tokens = this.tokens.concat({token});
    await this.save();

    return token;
}


//find an user with the given email & verify the password
userSchema.statics.findByCredentials = async (email, password) => {
    try {
        console.log("email: " + email);
        const user = await User.findOne({email});
        if(!user) {
            throw new Error("Unable to login");
        }

        const passwordVerification = bcrypt.compare(password, user.password);
        if(!passwordVerification) {
            throw new Error("Unable to login");
        }

        return user;
    } catch (error) {
        console.log("Some exception occurred : " + error);
        throw new Error(error.message);
    }
}

//hash the password befor saving it to db
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        //password is added/modified...hashing the same
        this.password = await bcrypt.hash(this.password, 8);
        console.log("Hashed password is : " + this.password);
    }

    next();
})

//Delete an users tasks when an user is remeoved
userSchema.pre('remove', async function (next) {
    await Task.deleteMany({ owner: this._id });
    next();
})

const User = mongoose.model('User', userSchema)

module.exports = User;