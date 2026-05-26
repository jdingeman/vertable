import { describe, it, expect, vi, beforeEach } from "vitest";
import * as controller from "../../controllers/users.controller.js";
import * as service from "../../services/users.service.js";
import { NotFoundError, RequiredFieldError } from "../../errors/index.js";

vi.mock("../../services/users.service.js");

const mockUser = {
  userId: 1,
  orgId: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  passwordHash: "hashedpassword",
  role: "member",
};

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

describe("users controller", () => {
  describe("getAllUsers", () => {
    it("responds with 200 and users", async () => {
      service.getAllUsers.mockResolvedValue([mockUser]);
      const res = makeRes();
      await controller.getAllUsers({}, res, vi.fn());
      expect(service.getAllUsers).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockUser]);
    });

    it("calls next with error when service throws", async () => {
      const err = new Error("DB error");
      service.getAllUsers.mockRejectedValue(err);
      const next = vi.fn();
      await controller.getAllUsers({}, makeRes(), next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("getUserById", () => {
    it("responds with 200 and the user", async () => {
      service.getUserById.mockResolvedValue(mockUser);
      const res = makeRes();
      await controller.getUserById({ params: { id: "1" } }, res, vi.fn());
      expect(service.getUserById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
    it("calls next with NotFoundError when not found", async () => {
      const err = new NotFoundError("User not found");
      service.getUserById.mockRejectedValue(err);
      const next = vi.fn();
      await controller.getUserById({ params: { id: "99" } }, makeRes(), next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("createUser", () => {
    it("responds with 201, location header, and user", async () => {
      service.createUser.mockResolvedValue(mockUser);
      const res = makeRes();
      const body = {
        orgId: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        passwordHash: "hashedpassword",
        role: "member",
      };
      await controller.createUser({ body }, res, vi.fn());
      expect(service.createUser).toHaveBeenCalledWith(body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.location).toHaveBeenCalledWith("/users/1");
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("calls next with RequiredFieldError when required field is missing", async () => {
      const err = new RequiredFieldError(
        "Missing required fields: orgId, firstName, lastName, email, passwordHash, role",
      );
      service.createUser.mockRejectedValue(err);
      const next = vi.fn();
      await controller.createUser({ body: {} }, makeRes(), next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("updateUser", () => {
    it("responds with 200 and updated user", async () => {
      const updated = { ...mockUser, firstName: "Jane" };
      service.updateUser.mockResolvedValue(updated);
      const res = makeRes();
      await controller.updateUser(
        {
          params: { id: "1" },
          body: { firstName: "Jane" },
        },
        res,
        vi.fn(),
      );
      expect(service.updateUser).toHaveBeenCalledWith("1", { firstName: "Jane" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it("calls next with NotFoundError when not found", async () => {
      const err = new NotFoundError("User not found");
      service.updateUser.mockRejectedValue(err);
      const next = vi.fn();
      await controller.updateUser(
        { params: { id: "99" }, body: { firstName: "Jane" } },
        makeRes(),
        next,
      );
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("deleteUser", () => {
    it("responds with 204", async () => {
      service.deleteUser.mockResolvedValue();
      const res = makeRes();
      await controller.deleteUser({ params: { id: "1" } }, res, vi.fn());
      expect(service.deleteUser).toHaveBeenCalledWith("1");
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it("calls next with NotFoundError when not found", async () => {
      const err = new NotFoundError("User not found");
      service.deleteUser.mockRejectedValue(err);
      const next = vi.fn();
      await controller.deleteUser({ params: { id: "99" } }, makeRes(), next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
