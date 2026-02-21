import { NotFoundError } from "../errors/index.js";
import * as tenantRepository from "../repositories/tenant.repository.js";
import { validateRequiredFields } from "../util/validation.js";

/**
 * @typedef {import('../models/tenant.model.js').Tenant} Tenant
 */

/**
 * Get all tenants.
 * @returns {Promise<Tenant[]>}
 */
export async function getAllTenants() {
  return tenantRepository.findAll();
}

/**
 * Get tenant by id.
 * @param {number} id
 * @returns {Promise<Tenant>}
 * @throws {NotFoundError} If tenant is not found.
 */
export async function getTenantById(id) {
  const tenant = await tenantRepository.findById(id);
  if (!tenant) {
    throw new NotFoundError("Tenant not found");
  }
  return tenant;
}

/**
 * Creates a new tenant.
 * @param {Omit<Tenant, 'tenant_id'>} data
 * @returns {Promise<Tenant>}
 */
export async function createTenant(data) {
  const required_fields = ["name", "tenant_type"];
  validateRequiredFields(data, required_fields);
  return tenantRepository.create(data);
}

/**
 * Updates tenant by id.
 * @param {number} id
 * @param {Omit<Tenant, 'tenant_id'>} data
 * @returns {Promise<Tenant>}
 */
export async function updateTenant(id, data) {
  const required_fields = ["name", "tenant_type"];
  const original = await getTenantById(id);
  const modified = { ...original, ...data };
  validateRequiredFields(modified, required_fields);

  return tenantRepository.update(id, data);
}

/**
 * Deletes tenant by id
 * @param {number} id id passed in
 * @returns {Promise<Tenant>}
 */
export async function deleteTenant(id) {
  await getTenantById(id);
  return tenantRepository.remove(id);
}
