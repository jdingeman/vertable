import * as usersService from "../services/users.service.js";

export async function getAllUsers(req, res, next) {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const user = await usersService.createUser(req.body);
    res.status(201).location(`/users/${user.userId}`).json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await usersService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await usersService.deleteUser(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
