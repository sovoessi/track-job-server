import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        match: [
            /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.)+([a-zA-Z0-9]{2,4})$/,
            "Please provide a valid email",
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

}, { timestamps: true });   

// Hash password before saving user
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;