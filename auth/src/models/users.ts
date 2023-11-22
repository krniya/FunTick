import mongoose from "mongoose";
import { Password } from '../utilities/password';

const gender = ['M', 'F']  //* gender enum for gender field (male or female)

//* An interface that describes the properties
//* that are required to create a new user
interface UserAttribute {
    name: string,
    email: string,
    password: string,
    dob: Date,
    gender: string
}

//* An interface that describes the properties
//* that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttribute): UserDoc
}

//* An interface that describes the properties
//* that a user document model has
interface UserDoc extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    dob: Date,
    gender: string
}


//* User Schema
//* {name, email, password, dob, gender, toJSON()}
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: gender
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.password
            delete ret.__v
        }
    }
})

//* Hashing the password using Password utilities
userSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed)
    }
    done()
})


//* Function to create new user.
//* using it instead of 'new User' to add type check
userSchema.statics.build =  (attrs: UserAttribute) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }