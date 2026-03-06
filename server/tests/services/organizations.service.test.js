import { describe, it, expect, vi, beforeEach } from "vitest";
import * as service from "../../services/organizations.service.js";
import * as repo from "../../repositories/organizations.repository.js";
import { NotFoundError, RequiredFieldError } from "../../errors/index.js";

vi.mock("../../repositories/organizations.repository.js");

const mockOrg = { orgId: 1, name: "Acme Corp", isActive: true };

beforeEach(() => {
  vi.resetAllMocks();
});

describe("organizations service", () => {
  describe("getAllOrganizations", () => {
    it("returns all organizations from repository", async () => {
      repo.findAll.mockResolvedValue([mockOrg]);
      const result = await service.getAllOrganizations();
      expect(result).toEqual([mockOrg]);
      expect(repo.findAll).toHaveBeenCalledOnce();
    });
  });

  describe("getOrganizationById", () => {
    it("returns organization when found", async () => {
      repo.findById.mockResolvedValue(mockOrg);
      const result = await service.getOrganizationById(1);
      expect(result).toEqual(mockOrg);
    });

    it("throws NotFoundError when not found", async () => {
      repo.findById.mockResolvedValue(undefined);
      await expect(service.getOrganizationById(99)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe("createOrganization", () => {
    it("creates and returns the organization", async () => {
      repo.create.mockResolvedValue(mockOrg);
      const result = await service.createOrganization({ name: "Acme Corp" });
      expect(result).toEqual(mockOrg);
      expect(repo.create).toHaveBeenCalledWith({ name: "Acme Corp" });
    });

    it("throws RequiredFieldError when name is missing", async () => {
      await expect(service.createOrganization({})).rejects.toThrow(
        RequiredFieldError,
      );
    });

    it("throws RequiredFieldError when name is empty string", async () => {
      await expect(
        service.createOrganization({ name: "" }),
      ).rejects.toThrow(RequiredFieldError);
    });
  });

  describe("updateOrganization", () => {
    it("updates and returns the organization", async () => {
      repo.findById.mockResolvedValue(mockOrg);
      repo.update.mockResolvedValue({ ...mockOrg, name: "Updated" });
      const result = await service.updateOrganization(1, { name: "Updated" });
      expect(result).toMatchObject({ name: "Updated" });
    });

    it("throws NotFoundError when organization does not exist", async () => {
      repo.findById.mockResolvedValue(undefined);
      await expect(
        service.updateOrganization(99, { name: "X" }),
      ).rejects.toThrow(NotFoundError);
    });

    it("throws RequiredFieldError when name is empty", async () => {
      repo.findById.mockResolvedValue(mockOrg);
      await expect(
        service.updateOrganization(1, { name: "" }),
      ).rejects.toThrow(RequiredFieldError);
    });
  });

  describe("deleteOrganization", () => {
    it("deletes the organization", async () => {
      repo.findById.mockResolvedValue(mockOrg);
      repo.remove.mockResolvedValue(mockOrg);
      await expect(service.deleteOrganization(1)).resolves.not.toThrow();
      expect(repo.remove).toHaveBeenCalledWith(1);
    });

    it("throws NotFoundError when organization does not exist", async () => {
      repo.findById.mockResolvedValue(undefined);
      await expect(service.deleteOrganization(99)).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});
