import express from "express";
import * as layoutTemplateController from "../controllers/layoutTemplate.controller.js";

const router = express.Router();

router.get("/", layoutTemplateController.getAllLayoutTemplates);
router.get("/:id", layoutTemplateController.getLayoutTemplateById);
router.post("/", layoutTemplateController.createLayoutTemplate);
router.patch("/:id", layoutTemplateController.updateLayoutTemplate);
router.delete("/:id", layoutTemplateController.deleteLayoutTemplate);

export default router;
