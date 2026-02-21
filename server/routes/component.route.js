import express from "express";
import * as componentController from "../controllers/component.controller.js";

const router = express.Router();

router.get("/", componentController.getAllComponents);
router.get("/:id", componentController.getComponentById);
router.post("/", componentController.createComponent);
router.patch("/:id", componentController.updateComponent);
router.delete("/:id", componentController.deleteComponent);

export default router;
