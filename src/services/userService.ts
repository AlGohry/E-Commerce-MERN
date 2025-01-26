import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Defining the RegisterParams interface with the required fields for registration
interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Register function
export const register = async ({ firstName, lastName, email, password }: RegisterParams) => {
  // Finding a user by email
  const findUser = await userModel.findOne({ email });

  // If the user already exists, return an error message
  if (findUser) {
    return { data: "User already exists!", statusCode: 400 };
  }

  // Creating a new user and saving it to the database
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new userModel({ email, password: hashedPassword, firstName, lastName });
  await newUser.save();

  // Returning the new user
  return { data: generateJWT({ firstName, lastName, email }), statusCode: 200 };
}

// Defining the LoginParams interface with the required fields for login
interface LoginParams {
  email: string;
  password: string;
}

// Login function
export const login = async ({ email, password }: LoginParams) => {
  // Finding a user by email
  const findUser = await userModel.findOne({ email });

  // If the user is not found, return an error message
  if (!findUser) {
    return { data: "Incorrect email or password!", statusCode: 400 };
  }

  // Checking if the password matches
  const passwordMatch = await bcrypt.compare(password, findUser.password);
  if (passwordMatch) {
    return { data: generateJWT({ email, firstName: findUser.firstName, lastName: findUser.lastName }), statusCode: 200 }; // If the password is correct, return the user
  }
  return { data: "Incorrect email or password!", statusCode: 400 }; // If the password is incorrect, return an error message
}



// const secretKey = "your-secret-key"; // استخدم مفتاح سري (قوي وخاص بمشروعك)

// دالة لتوليد التوكن
const generateJWT = (data: any) => {
  return jwt.sign(data, 'ZK6EKgAC9u6PV2KKVosVqA0BLYgp1Tnn', { expiresIn: "1h" })
}

