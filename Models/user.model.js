import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    role: {
        type: String,
        enum: ["user", "seller", "admin"],
        default: "user"
    },
    image: {
        type: String,
        default: "default.jpg"
    },
    phone: {
        type: String,
        sparse: true,
        unique: true,
        set: v => v === null || v === "" ? undefined : v,
        validate: {
            validator: function (v) {
                return validator.isMobilePhone(v, 'ar-EG');
            },
            message: 'Please enter a valid phone number'
        },

    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    is_active: {
        type: Boolean,
        default: true
    },

    is_verified: {
        type: Boolean,
        default: false
    },
    address: {
        type: addressSchema,
        defult: undefined
    },
    // paymentDetails: [paymentDetailSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],    
    
    cart_items :[
        {
            product :{
                type: mongoose.Schema.Types.ObjectId , 
                ref: 'Product',
                required : true
            },
            quantity :{
                type: Number,
                default:1
            }

        }

    ],
    
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

}, {
    timestamps: true,
    versionKey: false
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.pre("save", async function () {
    if (!this.isModified("password") || this.isNew) return;
    this.passwordChangedAt = Date.now() - 1000;
})

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (jwt_iat) {
    if (this.passwordChangedAt) {
        const changedPasswordTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return jwt_iat < changedPasswordTimestamp;
    }
    return false;
};


userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;