import express from 'express';
import { getUsers, deleteUserById, getUserById, postCreateUser } from '../services/users';
import { UserAttributes } from 'models/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getUserByID = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const user = await getUserById(id);

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deletedUser = await deleteUserById(id);

        return res.json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.sendStatus(400);
        }

        const user = await getUserById(id);

        user.name = name;
        await user.save();

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const createUser = async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.query)
        console.log(req.body)
        const { name, age } = req.body;

        // Vérifier les champs requis
        if (!name || !age) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        const userAttributes: UserAttributes = { name, age };
        const user = await postCreateUser(userAttributes);

        return res.status(201).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};