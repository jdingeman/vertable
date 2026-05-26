import express from "express";
import * as organizationsController from "../controllers/organizations.controller.js";

const router = express.Router();

router.get("/", organizationsController.getAllOrganizations);
router.get("/:id", organizationsController.getOrganizationById);
router.post("/", organizationsController.createOrganization);
router.patch("/:id", organizationsController.updateOrganization);
router.delete("/:id", organizationsController.deleteOrganization);

export default router;
