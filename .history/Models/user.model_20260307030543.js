import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
    city: {
        type: String,
        required: [true, "Please type your city!"]
    },
    street: {
        type: String,
        required: [true, "Please type your street!"]
    },
    building_number: {
        type: String,
        required: [true, "Please type your building number!"]
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please type your name!"]
    },
    // email: {
    //     type: String,
    //     required: [true, 'Please provide your email'],
    //     unique: true,
    //     lowercase: true,
    //     validate: [validator.isEmail, 'Please provide a valid email']
    // },
    // role: {
    //     type: String,
    //     enum: ["user", "seller", "admin"],
    //     default: "user"
    // },
    // image: {
    //     type: String,
    //     default: "default.jpg"
    // },
    // phone: {
    //     type: String,
    //     unique: true,
    //     validate: {
    //         validator: function (v) {
    //             return validator.isMobilePhone(v, 'ar-EG');
    //         },
    //         message: 'Please enter a valid phone number'
    //     },
        
    // },
    // password: {
    //     type: String,
    //     required: [true, 'Please provide a password'],
    //     minlength: 8,
    //     select: false
    // },
    // passwordConfirm: {
    //     type: String,
    //     required: [true, 'Please confirm your password'],
    //     validate: {
    //         // This only works on CREATE and SAVE!!!
    //         validator: function (el) {
    //             return el === this.password;
    //         },
    //         message: 'Passwords are not the same!'
    //     }
    // },
    // is_active: {
    //     type: Boolean,
    //     default: true 
    // },

    // is_verified: {
    //     type: Boolean,
    //     default: false
    // },
    // address: [addressSchema],

    // // paymentDetails: [paymentDetailSchema],
    // wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    cart_items :{
        type : Map,
        of : Number
    },
    
}, {
    timestamps: true,
    versionKey: false
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});


userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


const User = mongoose.model("User", userSchema);
export default User;