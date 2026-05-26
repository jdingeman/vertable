import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import organizationsRouter from "../../routes/organizations.route.js";
import * as service from "../../services/organizations.service.js";
import { NotFoundError, RequiredFieldError } from "../../errors/index.js";

vi.mock("../../services/organizations.service.js");

const app = express();
app.use(express.json());
app.use("/organizations", organizationsRouter);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const mockOrg = { orgId: 1, name: "Acme Corp", isActive: true };

beforeEach(() => {
  vi.resetAllMocks();
});

describe("organizations routes", () => {
  describe("GET /organizations", () => {
    it("returns 200 with organizations", async () => {
      service.getAllOrganizations.mockResolvedValue([mockOrg]);
      const res = await request(app).get("/organizations");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockOrg]);
    });
  });

  describe("GET /organizations/:id", () => {
    it("returns 200 with organization", async () => {
      service.getOrganizationById.mockResolvedValue(mockOrg);
      const res = await request(app).get("/organizations/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockOrg);
    });

    it("returns 404 when not found", async () => {
      service.getOrganizationById.mockRejectedValue(
        new NotFoundError("Organization not found"),
      );
      const res = await request(app).get("/organizations/99");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Organization not found" });
    });
  });

  describe("POST /organizations", () => {
    it("returns 201 with created organization", async () => {
      service.createOrganization.mockResolvedValue(mockOrg);
      const res = await request(app)
        .post("/organizations")
        .send({ name: "Acme Corp" });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockOrg);
    });

    it("returns 400 when name is missing", async () => {
      service.createOrganization.mockRejectedValue(
        new RequiredFieldError("Missing required fields: name"),
      );
      const res = await request(app).post("/organizations").send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Missing required fields: name" });
    });
  });

  describe("PATCH /organizations/:id", () => {
    it("returns 200 with updated organization", async () => {
      const updated = { ...mockOrg, name: "Updated" };
      service.updateOrganization.mockResolvedValue(updated);
      const res = await request(app)
        .patch("/organizations/1")
        .send({ name: "Updated" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it("returns 404 when not found", async () => {
      service.updateOrganization.mockRejectedValue(
        new NotFoundError("Organization not found"),
      );
      const res = await request(app)
        .patch("/organizations/99")
        .send({ name: "X" });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /organizations/:id", () => {
    it("returns 204", async () => {
      service.deleteOrganization.mockResolvedValue();
      const res = await request(app).delete("/organizations/1");
      expect(res.status).toBe(204);
    });

    it("returns 404 when not found", async () => {
      service.deleteOrganization.mockRejectedValue(
        new NotFoundError("Organization not found"),
      );
      const res = await request(app).delete("/organizations/99");
      expect(res.status).toBe(404);
    });
  });
});
