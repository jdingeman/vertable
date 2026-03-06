import { NotFoundError } from "../errors/index.js";
import * as organizationsRepository from "../repositories/organizations.repository.js";
import { validateRequiredFields } from "../util/validation.js";

export async function getAllOrganizations() {
  return organizationsRepository.findAll();
}

export async function getOrganizationById(id) {
  const organization = await organizationsRepository.findById(id);
  if (!organization) {
    throw new NotFoundError("Organization not found");
  }
  return organization;
}

export async function createOrganization(data) {
  const required_fields = ["name"];
  validateRequiredFields(data, required_fields);
  return organizationsRepository.create(data);
}

export async function updateOrganization(id, data) {
  const required_fields = ["name"];
  const original = await getOrganizationById(id);
  const modified = { ...original, ...data };
  validateRequiredFields(modified, required_fields);

  return organizationsRepository.update(id, data);
}

export async function deleteOrganization(id) {
  await getOrganizationById(id);
  return organizationsRepository.remove(id);
}
