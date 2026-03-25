import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please provide an email"],
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: {
            value: true,
            message: 'Password is required'
        },
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: {
            value: true,
            message: 'Confirm your password'
        },
        minlength: 8,
        validate: {
            validator: function(value) {
                return value === this.password;
            },
            message: "Password doesn't match"
        },
        select: false
    }
});

// Hash password before saving to database
userSchema.pre('save', async function() {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return;
    }

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        

        // Remove passwordConfirm from the document before saving
        this.passwordConfirm = undefined;
    } catch (error) {
        throw error;
    }
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);