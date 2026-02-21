import * as tenantService from "../services/tenant.service.js";

export async function getAllTenants(req, res, next) {
  try {
    const tenants = await tenantService.getAllTenants();
    res.status(200).json(tenants);
  } catch (err) {
    next(err);
  }
}

export async function getTenantById(req, res, next) {
  try {
    const tenant = await tenantService.getTenantById(req.params.id);
    res.status(200).json(tenant);
  } catch (err) {
    next(err);
  }
}

export async function createTenant(req, res, next) {
  try {
    const tenant = await tenantService.createTenant(req.body);
    res.status(201).location(`/tenants/${tenant.tenant_id}`).json(tenant);
  } catch (err) {
    next(err);
  }
}

export async function updateTenant(req, res, next) {
  try {
    const tenant = await tenantService.updateTenant(req.params.id, req.body);
    res.status(200).json(tenant);
  } catch (err) {
    next(err);
  }
}

export async function deleteTenant(req, res, next) {
  try {
    const deleted = await tenantService.deleteTenant(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
