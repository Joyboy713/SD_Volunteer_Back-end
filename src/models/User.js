import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true,  },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  profilePicture: { type: String }, // Path or URL for the profile picture
  address: {
    streetAddress: { type: String, required: true },
    streetAddress2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  volunteeringPreferences: {
    tshirts: { type: String },
    ticketSales: { type: String },
    raffleTicketSales: { type: String },
    trafficParking: { type: String },
    cleanupGrounds: { type: String },
  },
  shiftPreferences: {
    morning: { type: String },
    afternoon: { type: String },
    evening: { type: String },
  },
  skills: [{ type: String }], // Array of strings for user skills
  preferences: { type: String }, // String for user preferences
  availability: {
    startDate: { type: Date }, // Start date of availability
    endDate: { type: Date }, // End date of availability
  },
}, { timestamps: true });

// Pre-save middleware to hash the password before saving the user
userSchema.pre('save', async function (next) {
  this.email = this.email.toLowerCase();
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
