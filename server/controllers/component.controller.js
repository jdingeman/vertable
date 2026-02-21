import * as componentService from "../services/component.service.js";

export async function getAllComponents(req, res, next) {
  try {
    const components = await componentService.getAllComponents();
    res.status(200).json(components);
  } catch (err) {
    next(err);
  }
}

export async function getComponentById(req, res, next) {
  try {
    const component = await componentService.getComponentById(req.params.id);
    res.status(200).json(component);
  } catch (err) {
    next(err);
  }
}

export async function createComponent(req, res, next) {
  try {
    const component = await componentService.createComponent(req.body);
    res
      .status(201)
      .location(`/components/${component.component_id}`)
      .json(component);
  } catch (err) {
    next(err);
  }
}

export async function updateComponent(req, res, next) {
  try {
    const component = await componentService.updateComponent(
      req.params.id,
      req.body
    );
    res.status(200).json(component);
  } catch (err) {
    next(err);
  }
}

export async function deleteComponent(req, res, next) {
  try {
    const deleted = await componentService.deleteComponent(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
