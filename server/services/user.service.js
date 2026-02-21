import { NotFoundError } from "../errors/index.js";
import * as userRepository from "../repositories/user.repository.js";
import { validateRequiredFields } from "../util/validation.js";

export async function getAllUsers() {
  return userRepository.findAll();
}

export async function getUserById(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}

export async function createUser(data) {
  const required_fields = [
    "tenant_id",
    "first_name",
    "last_name",
    "email",
    "password_hash",
    "is_superuser",
  ];
  validateRequiredFields(data, required_fields);
  return userRepository.create(data);
}

export async function updateUser(id, data) {
  const required_fields = [
    "tenant_id",
    "first_name",
    "last_name",
    "email",
    "password_hash",
    "is_superuser",
  ];
  const original = await getUserById(id);
  const modified = { ...original, ...data };
  validateRequiredFields(modified, required_fields);

  return userRepository.update(id, data);
}

export async function deleteUser(id) {
  await getUserById(id);
  return userRepository.remove(id);
}
