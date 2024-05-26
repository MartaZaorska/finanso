import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Imię jest wymagane']
  },
  surname: {
    type: String,
    required: [true, 'Nazwisko jest wymagane']
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }]
}, {
  timestamps: true
});

UserSchema.methods.checkPassword = async function(password){
  return await bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = async function(password){
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

const User = mongoose.model("User", UserSchema);

export default User;