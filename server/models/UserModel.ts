import mongoose, { Document, Model } from 'mongoose';
import bcrpyt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  generateToken: any;
  comparePassword: any;
  email: string;
  password?: string;
  name: string;
  birthday?: Date;
  profile?: string;
  role: number;
  token?: string;
  tokenExp?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserStatics extends Model<IUser> {
  findByToken(token: string, cb: any): void;
}

const userSchema = new mongoose.Schema<IUser, UserStatics>(
  {
    email: {
      type: String,
      required: true,
      maxlength: 320,
      trim: true,
      unique: 1, //do not allow duplicate data
    },
    password: {
      type: String,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    birthday: {
      type: Date,
      maxlength: 10,
    },
    profile: {
      type: String,
      maxlength: 200,
    },
    role: {
      type: Number,
      required: true,
      default: 0, // 0: normal user, 1: admin user
    },
    token: {
      type: String,
    },
    tokenExp: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Encrypt user password before saving into DB
userSchema.pre('save', function (next) {
  const user = this;
  const saltRounds = 10;

  if (user.isModified('password')) {
    bcrpyt.hash(user.password!, saltRounds, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

// check encrypted password with given password
userSchema.methods.comparePassword = function (password: string, cb: any) {
  bcrpyt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// generate token and save into DB
userSchema.methods.generateToken = function (isRemainLogin: boolean, cb: any) {
  const user = this;

  const token = jwt.sign(user._id.toHexString(), 'userToken');
  user.token = token;

  // if user select remain login, token will expire 30days later
  // unless it will expire in 24 hours
  let expired;
  if (isRemainLogin) {
    expired = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  } else {
    const hours = 24;
    expired = new Date(Date.now() + hours * 60 * 60 * 1000);
  }
  user.tokenExp = expired;

  user.save(function (err: Error, user: IUser) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token: string, cb: any) {
  const user = this;

  // decode token
  jwt.verify(token, 'userToken', function (err: any, decoded: any) {
    if (err) return cb(err);

    user.findOne(
      { _id: decoded, token: token },
      function (err: Error, user: IUser) {
        if (err) return cb(err);
        cb(null, user);
      }
    );
  });
};

const UserModel = mongoose.model<IUser, UserStatics>('User', userSchema);
export default UserModel;
