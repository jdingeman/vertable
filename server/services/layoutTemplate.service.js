import { NotFoundError } from "../errors/index.js";
import * as layoutTemplateRepository from "../repositories/layoutTemplate.repository.js";
import { validateRequiredFields } from "../util/validation.js";

export async function getAllLayoutTemplates() {
  return layoutTemplateRepository.findAll();
}

export async function getLayoutTemplateById(id) {
  const layoutTemplate = await layoutTemplateRepository.findById(id);
  if (!layoutTemplate) {
    throw new NotFoundError("Layout template not found");
  }
  return layoutTemplate;
}

export async function createLayoutTemplate(data) {
  const required_fields = ["owner_tenant_id", "created_by_user_id"];
  validateRequiredFields(data, required_fields);
  return layoutTemplateRepository.create(data);
}

export async function updateLayoutTemplate(id, data) {
  const required_fields = ["owner_tenant_id", "created_by_user_id"];
  const original = await getLayoutTemplateById(id);
  const modified = { ...original, ...data };
  validateRequiredFields(modified, required_fields);

  return layoutTemplateRepository.update(id, data);
}

export async function deleteLayoutTemplate(id) {
  await getLayoutTemplateById(id);
  return layoutTemplateRepository.remove(id);
}
