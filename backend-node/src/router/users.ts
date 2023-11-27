import express from 'express';

import { getAllUsers, deleteUser, updateUser, createUser, getUserByID } from '../controllers/users';

export default (router: express.Router) => {
    router.get('/users', getAllUsers);
    router.get('/users/:id', getUserByID);
    router.delete('/users/:id', deleteUser);
    router.patch('/users/:id', updateUser);
    router.post('/users', createUser);
};