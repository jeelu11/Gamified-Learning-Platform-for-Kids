import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  email: string;
  username: string;
  password: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
    age?: number;
    grade?: number;
    school?: string;
    bio?: string;
  };
  settings: {
    notifications: boolean;
    soundEnabled: boolean;
    theme: 'light' | 'dark';
    language: string;
  };
  subscription: {
    type: 'free' | 'premium' | 'family' | 'school';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt?: Date;
    stripeCustomerId?: string;
  };
  parentCode?: string;
  linkedParents: mongoose.Types.ObjectId[];
  linkedChildren: mongoose.Types.ObjectId[];
  classroom?: mongoose.Types.ObjectId;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateParentCode(): string;
  getFullName(): string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['student', 'parent', 'teacher', 'admin'],
      message: 'Role must be student, parent, teacher, or admin'
    },
    default: 'student'
  },
  profile: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: {
      type: String,
      default: function() {
        // Default avatar based on role
        const avatars = {
          student: '👦',
          parent: '👨‍👩‍👧‍👦',
          teacher: '👩‍🏫',
          admin: '👨‍💼'
        };
        return avatars[this.role] || '👤';
      }
    },
    age: {
      type: Number,
      min: [6, 'Age must be at least 6'],
      max: [12, 'Age must be 12 or younger'],
      validate: {
        validator: function(this: IUser, value: number) {
          // Age is required for students
          if (this.role === 'student') {
            return value !== undefined;
          }
          return true;
        },
        message: 'Age is required for students'
      }
    },
    grade: {
      type: Number,
      min: [1, 'Grade must be at least 1'],
      max: [12, 'Grade must be 12 or lower']
    },
    school: {
      type: String,
      maxlength: [100, 'School name cannot exceed 100 characters']
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    }
  },
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    soundEnabled: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    language: {
      type: String,
      default: 'en',
      maxlength: [5, 'Language code cannot exceed 5 characters']
    }
  },
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'family', 'school'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    },
    expiresAt: {
      type: Date
    },
    stripeCustomerId: {
      type: String,
      select: false
    }
  },
  parentCode: {
    type: String,
    unique: true,
    sparse: true,
    select: false
  },
  linkedParents: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  linkedChildren: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.parentCode;
      delete ret.subscription.stripeCustomerId;
      return ret;
    }
  }
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ parentCode: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1, emailVerified: 1 });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Generate parent code for students
userSchema.pre('save', function(next) {
  if (this.role === 'student' && !this.parentCode) {
    this.parentCode = this.generateParentCode();
  }
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

userSchema.methods.generateParentCode = function(): string {
  // Generate a unique 8-character parent code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

userSchema.methods.getFullName = function(): string {
  return `${this.profile.firstName} ${this.profile.lastName}`.trim();
};

// Virtual fields
userSchema.virtual('isUnder13').get(function() {
  return this.role === 'student' && (this.profile.age || 0) < 13;
});

userSchema.virtual('needsParentalConsent').get(function() {
  return this.isUnder13 && !this.linkedParents.length;
});

// Static methods
userSchema.statics.findByEmailOrUsername = function(identifier: string) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  }).select('+password');
};

userSchema.statics.findByParentCode = function(parentCode: string) {
  return this.findOne({
    parentCode: parentCode.toUpperCase(),
    role: 'student',
    isActive: true
  });
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;