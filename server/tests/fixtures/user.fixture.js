import { Types } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { person, internet } from '@faker-js/faker';
import { insertMany } from '../../src/models/user.model';

const password = 'password1';
const salt = genSaltSync(8);
const hashedPassword = hashSync(password, salt);

const userOne = {
  _id: new Types.ObjectId(),
  name: person.fullName(),
  email: internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const userTwo = {
  _id: new Types.ObjectId(),
  name: person.fullName(),
  email: internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const admin = {
  _id: new Types.ObjectId(),
  name: person.fullName(),
  email: internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
};

const insertUsers = async (users) => {
  await insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

export default {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
