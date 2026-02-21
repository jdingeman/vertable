import { NotFoundError } from "../errors/index.js";
import * as componentRepository from "../repositories/component.repository.js";
import { validateRequiredFields } from "../util/validation.js";

export async function getAllComponents() {
  return componentRepository.findAll();
}

export async function getComponentById(id) {
  const component = await componentRepository.findById(id);
  if (!component) {
    throw new NotFoundError("Component not found");
  }
  return component;
}

export async function createComponent(data) {
  const required_fields = ["component_key", "display_name"];
  validateRequiredFields(data, required_fields);
  return componentRepository.create(data);
}

export async function updateComponent(id, data) {
  const required_fields = ["component_key", "display_name"];
  const original = await getComponentById(id);
  const modified = { ...original, ...data };
  validateRequiredFields(modified, required_fields);

  return componentRepository.update(id, data);
}

export async function deleteComponent(id) {
  await getComponentById(id);
  return componentRepository.remove(id);
}
