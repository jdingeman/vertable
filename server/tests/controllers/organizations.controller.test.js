import { describe, it, expect, vi, beforeEach } from "vitest";
import * as controller from "../../controllers/organizations.controller.js";
import * as service from "../../services/organizations.service.js";
import { NotFoundError, RequiredFieldError } from "../../errors/index.js";

vi.mock("../../services/organizations.service.js");

const mockOrg = { orgId: 1, name: "Acme Corp", isActive: true };

function makeRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    sendStatus: vi.fn().mockReturnThis(),
    location: vi.fn().mockReturnThis(),
  };
  return res;
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("organizations controller", () => {
  describe("getAllOrganizations", () => {
    it("responds with 200 and organizations", async () => {
      service.getAllOrganizations.mockResolvedValue([mockOrg]);
      const res = makeRes();
      await controller.getAllOrganizations({}, res, vi.fn());
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockOrg]);
    });

    it("calls next with error when service throws", async () => {
      const err = new Error("DB error");
      service.getAllOrganizations.mockRejectedValue(err);
      const next = vi.fn();
      await controller.getAllOrganizations({}, makeRes(), next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("getOrganizationById", () => {
    it("responds with 200 and the organization", async () => {
      service.getOrganizationById.mockResolvedValue(mockOrg);
      const res = makeRes();
      await controller.getOrganizationById({ params: { id: "1" } }, res, vi.fn());
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOrg);
    });

    it("calls next with NotFoundError when not found", async () => {
      const err = new NotFoundError("Organization not found");
      service.getOrganizationById.mockRejectedValue(err);
      const next = vi.fn();
      await controller.getOrganizationById({ params: { id: "99" } }, makeRes(), next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("createOrganization", () => {
    it("responds with 201, location header, and organization", async () => {
      service.createOrganization.mockResolvedValue(mockOrg);
      const res = makeRes();
      await controller.createOrganization({ body: { name: "Acme Corp" } }, res, vi.fn());
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.location).toHaveBeenCalledWith("/organizations/1");
      expect(res.json).toHaveBeenCalledWith(mockOrg);
    });

    it("calls next with RequiredFieldError when name is missing", async () => {
      const err = new RequiredFieldError("Missing required fields: name");
      service.createOrganization.mockRejectedValue(err);
      const next = vi.fn();
      await controller.createOrganization({ body: {} }, makeRes(), next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("updateOrganization", () => {
    it("responds with 200 and updated organization", async () => {
      const updated = { ...mockOrg, name: "Updated" };
      service.updateOrganization.mockResolvedValue(updated);
      const res = makeRes();
      await controller.updateOrganization(
        { params: { id: "1" }, body: { name: "Updated" } },
        res,
        vi.fn(),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it("calls next with NotFoundError when not found", async () => {
      const err = new NotFoundError("Organization not found");
      service.updateOrganization.mockRejectedValue(err);
      const next = vi.fn();
      await controller.updateOrganization(
        { params: { id: "99" }, body: { name: "X" } },
        makeRes(),
        next,
      );
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("deleteOrganization", () => {
    it("responds with 204", async () => {
      service.deleteOrganization.mockResolvedValue();
      const res = makeRes();
      await controller.deleteOrganization({ params: { id: "1" } }, res, vi.fn());
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it("calls next with NotFoundError when not found", async () => {
      const err = new NotFoundError("Organization not found");
      service.deleteOrganization.mockRejectedValue(err);
      const next = vi.fn();
      await controller.deleteOrganization({ params: { id: "99" } }, makeRes(), next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
