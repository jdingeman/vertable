import * as organizationsService from "../services/organizations.service.js";

export async function getAllOrganizations(req, res, next) {
  try {
    const organizations = await organizationsService.getAllOrganizations();
    res.status(200).json(organizations);
  } catch (err) {
    next(err);
  }
}

export async function getOrganizationById(req, res, next) {
  try {
    const organization = await organizationsService.getOrganizationById(
      req.params.id,
    );
    res.status(200).json(organization);
  } catch (err) {
    next(err);
  }
}

export async function createOrganization(req, res, next) {
  try {
    const organization = await organizationsService.createOrganization(
      req.body,
    );
    res
      .status(201)
      .location(`/organizations/${organization.orgId}`)
      .json(organization);
  } catch (err) {
    next(err);
  }
}

export async function updateOrganization(req, res, next) {
  try {
    const organization = await organizationsService.updateOrganization(
      req.params.id,
      req.body,
    );
    res.status(200).json(organization);
  } catch (err) {
    next(err);
  }
}

export async function deleteOrganization(req, res, next) {
  try {
    const deleted = await organizationsService.deleteOrganization(
      req.params.id,
    );
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
