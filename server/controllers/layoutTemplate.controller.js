import * as layoutTemplateService from "../services/layoutTemplate.service.js";

export async function getAllLayoutTemplates(req, res, next) {
  try {
    const layoutTemplates = await layoutTemplateService.getAllLayoutTemplates();
    res.status(200).json(layoutTemplates);
  } catch (err) {
    next(err);
  }
}

export async function getLayoutTemplateById(req, res, next) {
  try {
    const layoutTemplate = await layoutTemplateService.getLayoutTemplateById(
      req.params.id
    );
    res.status(200).json(layoutTemplate);
  } catch (err) {
    next(err);
  }
}

export async function createLayoutTemplate(req, res, next) {
  try {
    const layoutTemplate = await layoutTemplateService.createLayoutTemplate(
      req.body
    );
    res
      .status(201)
      .location(`/layout_templates/${layoutTemplate.layout_template_id}`)
      .json(layoutTemplate);
  } catch (err) {
    next(err);
  }
}

export async function updateLayoutTemplate(req, res, next) {
  try {
    const layoutTemplate = await layoutTemplateService.updateLayoutTemplate(
      req.params.id,
      req.body
    );
    res.status(200).json(layoutTemplate);
  } catch (err) {
    next(err);
  }
}

export async function deleteLayoutTemplate(req, res, next) {
  try {
    const deleted = await layoutTemplateService.deleteLayoutTemplate(
      req.params.id
    );
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
