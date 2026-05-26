import { NotFoundError } from "../errors/index.js";
import * as usersRepository from "../repositories/users.repository.js";
import { validateRequiredFields } from "../util/validation.js";

export async function getAllUsers() {
  return usersRepository.findAll();
}

export async function getUserById(id) {
  const user = await usersRepository.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}

export async function createUser(data) {
  const required_fields = [
    "orgId",
    "firstName",
    "lastName",
    "email",
    "passwordHash",
    "role",
  ];
  validateRequiredFields(data, required_fields);
  return usersRepository.create(data);
}

export async function updateUser(id, data) {
  const required_fields = [
    "orgId",
    "firstName",
    "lastName",
    "email",
    "passwordHash",
    "role",
  ];
  const original = await getUserById(id);
  const modified = { ...original, ...data };
  validateRequiredFields(modified, required_fields);

  return usersRepository.update(id, data);
}

export async function deleteUser(id) {
  await getUserById(id);
  return usersRepository.remove(id);
}
