import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import usersRouter from "../../routes/users.route.js";
import * as service from "../../services/users.service.js";
import { NotFoundError, RequiredFieldError } from "../../errors/index.js";

vi.mock("../../services/users.service.js");

const app = express();
app.use(express.json());
app.use("/users", usersRouter);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const mockUser = {
  userId: 1,
  orgId: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  passwordHash: "hashedpassword",
  role: "member",
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("users routes", () => {
  describe("GET /users", () => {
    it("returns 200 with users", async () => {
      service.getAllUsers.mockResolvedValue([mockUser]);
      const res = await request(app).get("/users");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockUser]);
    });
  });

  describe("GET /users/:id", () => {
    it("returns 200 with user", async () => {
      service.getUserById.mockResolvedValue(mockUser);
      const res = await request(app).get("/users/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });

    it("returns 404 when not found", async () => {
      service.getUserById.mockRejectedValue(
        new NotFoundError("User not found"),
      );
      const res = await request(app).get("/users/99");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "User not found" });
    });
  });

  describe("POST /users", () => {
    it("returns 201 with created user", async () => {
      service.createUser.mockResolvedValue(mockUser);
      const res = await request(app).post("/users").send({
        orgId: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        passwordHash: "hashedpassword",
        role: "member",
      });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockUser);
    });

    it("returns 400 when required fields are missing", async () => {
      service.createUser.mockRejectedValue(
        new RequiredFieldError(
          "Missing required fields: orgId, firstName, lastName, email, passwordHash, role",
        ),
      );
      const res = await request(app).post("/users").send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error:
          "Missing required fields: orgId, firstName, lastName, email, passwordHash, role",
      });
    });
  });

  describe("PATCH /users/:id", () => {
    it("returns 200 with updated user", async () => {
      const updated = { ...mockUser, firstName: "Jane" };
      service.updateUser.mockResolvedValue(updated);
      const res = await request(app)
        .patch("/users/1")
        .send({ firstName: "Jane" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it("returns 404 when not found", async () => {
      service.updateUser.mockRejectedValue(new NotFoundError("User not found"));
      const res = await request(app)
        .patch("/users/99")
        .send({ firstName: "X" });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /users/:id", () => {
    it("returns 204", async () => {
      service.deleteUser.mockResolvedValue();
      const res = await request(app).delete("/users/1");
      expect(res.status).toBe(204);
    });

    it("returns 404 when not found", async () => {
      service.deleteUser.mockRejectedValue(new NotFoundError("User not found"));
      const res = await request(app).delete("/users/99");
      expect(res.status).toBe(404);
    });
  });
});
