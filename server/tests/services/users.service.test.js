import { describe, it, expect, vi, beforeEach } from "vitest";
import * as service from "../../services/users.service.js";
import * as repo from "../../repositories/users.repository.js";
import { NotFoundError, RequiredFieldError } from "../../errors/index.js";

vi.mock("../../repositories/users.repository.js");

const mockUser = {
  userId: 1,
  orgId: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  passwordHash: "hashedpassword",
  role: "member",
};

const createValidUser = () => ({
  userId: 1,
  orgId: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  passwordHash: "hashedpassword",
  role: "member",
});

beforeEach(() => {
  vi.resetAllMocks();
});

describe("users service", () => {
  describe("getAllUsers", () => {
    it("returns all users from repository", async () => {
      repo.findAll.mockResolvedValue([mockUser]);
      const result = await service.getAllUsers();
      expect(result).toEqual([mockUser]);
      expect(repo.findAll).toHaveBeenCalledOnce();
    });
  });

  describe("getUserById", () => {
    it("returns user when found", async () => {
      repo.findById.mockResolvedValue(mockUser);
      const result = await service.getUserById(1);
      expect(result).toEqual(mockUser);
    });

    it("throws NotFoundError when not found", async () => {
      repo.findById.mockResolvedValue(undefined);
      await expect(service.getUserById(99)).rejects.toThrow(NotFoundError);
    });
  });

  describe("createUser", () => {
    it("creates and returns the user", async () => {
      const input = createValidUser();
      repo.create.mockResolvedValue(mockUser);

      const result = await service.createUser(input);

      expect(repo.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockUser);
    });

    it("throws a RequiredFieldError when orgId is missing", async () => {
      const input = { ...createValidUser(), orgId: null };
      await expect(service.createUser(input)).rejects.toThrow(
        RequiredFieldError,
      );
    });

    it("throws a RequiredFieldError when firstName is missing", async () => {
      const input = { ...createValidUser(), firstName: null };
      await expect(service.createUser(input)).rejects.toThrow(
        RequiredFieldError,
      );
    });

    it("throws a RequiredFieldError when lastName is missing", async () => {
      const input = { ...createValidUser(), lastName: null };
      await expect(service.createUser(input)).rejects.toThrow(
        RequiredFieldError,
      );
    });

    it("throws a RequiredFieldError when role is missing", async () => {
      const input = { ...createValidUser(), role: null };
      await expect(service.createUser(input)).rejects.toThrow(
        RequiredFieldError,
      );
    });

    it("throws a RequiredFieldError when email is missing", async () => {
      const input = { ...createValidUser(), email: null };
      await expect(service.createUser(input)).rejects.toThrow(
        RequiredFieldError,
      );
    });

    it("throws a RequiredFieldError when passwordHash is missing", async () => {
      const input = { ...createValidUser(), passwordHash: null };
      await expect(service.createUser(input)).rejects.toThrow(
        RequiredFieldError,
      );
    });
  });

  describe("updateUser", () => {
    it("updates and returns the user", async () => {
      const patch = { firstName: "Jane" };
      repo.findById.mockResolvedValue(mockUser);
      repo.update.mockResolvedValue({ ...mockUser, ...patch });

      const result = await service.updateUser(1, patch);

      expect(repo.update).toHaveBeenCalledWith(1, patch);
      expect(result).toEqual({ ...mockUser, firstName: "Jane" });
    });

    it("throws NotFoundError when user does not exist", async () => {
      repo.findById.mockResolvedValue(undefined);
      await expect(service.updateUser(99, { firstName: "X" })).rejects.toThrow(
        NotFoundError,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    it("throws RequiredFieldError when patch nulls a required field", async () => {
      repo.findById.mockResolvedValue(mockUser);
      await expect(service.updateUser(1, { firstName: null })).rejects.toThrow(
        RequiredFieldError,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteUser", () => {
    it("deletes the user", async () => {
      repo.findById.mockResolvedValue(mockUser);
      repo.remove.mockResolvedValue(mockUser);
      await expect(service.deleteUser(1)).resolves.not.toThrow();
      expect(repo.remove).toHaveBeenCalledWith(1);
    });

    it("throws NotFoundError when trying to delete non-existent user", async () => {
      repo.findById.mockResolvedValue(undefined);
      await expect(service.deleteUser(99)).rejects.toThrow(NotFoundError);
      expect(repo.remove).not.toHaveBeenCalled();
    });
  });
});
