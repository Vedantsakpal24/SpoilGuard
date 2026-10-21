import mongoose from 'mongoose';

const PantryItemSchema = new mongoose.Schema({
  fruitName: { 
    type: String, 
    required: true,
    trim: true 
  },
  zone: { 
    type: String, 
    enum: ['Fridge', 'Countertop', 'Dark Cupboard'], 
    default: 'Countertop' 
  },
  addedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const UserPantrySchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  items: [PantryItemSchema],
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt
});

// Middleware to update lastUpdated on save
UserPantrySchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Prevent model recompilation error in Next.js (Hot Reloading)
const UserPantry = mongoose.models.UserPantry || mongoose.model('UserPantry', UserPantrySchema);

export default UserPantry;
