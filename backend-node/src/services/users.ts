import { UserAttributes } from "models/users";
import { UserModel } from "../db/users";

// User Actions
export const getUsers = () => UserModel.find();
export const getUserByName = (name: string) => UserModel.findOne({ name });
export const getUserById = (id: string) => UserModel.findById(id);
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);

export const postCreateUser = async (values: UserAttributes) => {
    const newUser = new UserModel(values);
    const user = await newUser.save();
    return user;
}