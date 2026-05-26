import "dotenv/config";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { reset } from "drizzle-seed";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import * as schema from "../../db/schema.js";
import * as repo from "../../repositories/users.repository.js";

beforeEach(async () => {
  await reset(db, schema);
});

afterAll(async () => {
  await reset(db, schema);
});

// Helper function to create a test organization for foreign key constraints
async function createTestOrg(name = "Acme Corp") {
  return await db.insert(schema.organizations).values({ name }).returning();
}

describe("users repository", () => {
  describe("findAll", () => {
    it("returns empty array when no users exist", async () => {
      const result = await repo.findAll();
      expect(result).toEqual([]);
    });

    it("returns all users", async () => {
      const fkOrg = await createTestOrg();

      const inserted = await db
        .insert(users)
        .values([
          {
            firstName: "John",
            lastName: "Doe",
            role: "member",
            email: "john.doe@example.com",
            orgId: fkOrg[0].orgId,
            passwordHash: "hashedpassword",
          },
          {
            firstName: "Jane",
            lastName: "Smith",
            role: "member",
            email: "jane.smith@example.com",
            orgId: fkOrg[0].orgId,
            passwordHash: "hashedpassword",
          },
        ])
        .returning();
      const result = await repo.findAll();
      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining(inserted));
    });
  });

  describe("findById", () => {
    it("returns the user when found", async () => {
      const fkOrg = await createTestOrg();

      const [user] = await db
        .insert(users)
        .values({
          firstName: "John",
          lastName: "Doe",
          role: "member",
          email: "john.doe@example.com",
          orgId: fkOrg[0].orgId,
          passwordHash: "hashedpassword",
        })
        .returning();
      const result = await repo.findById(user.userId);
      expect(result).toMatchObject({
        userId: user.userId,
        firstName: "John",
        lastName: "Doe",
        role: "member",
        email: "john.doe@example.com",
        orgId: fkOrg[0].orgId,
        passwordHash: "hashedpassword",
      });
    });

    it("returns undefined when not found", async () => {
      const result = await repo.findById(99999);
      expect(result).toBeUndefined();
    });
  });

  describe("create", () => {
    it("inserts and returns the new user", async () => {
      const fkOrg = await createTestOrg();

      const result = await repo.create({
        firstName: "John",
        lastName: "Doe",
        role: "member",
        email: "john.doe@example.com",
        orgId: fkOrg[0].orgId,
        passwordHash: "hashedpassword",
      });
      expect(result).toMatchObject({
        firstName: "John",
        lastName: "Doe",
        role: "member",
        email: "john.doe@example.com",
        orgId: fkOrg[0].orgId,
        passwordHash: "hashedpassword",
      });
      expect(result.userId).toBeDefined();
    });

    it("rejects insert when orgId does not reference an existing organization", async () => {
      await expect(
        repo.create({
          firstName: "John",
          lastName: "Doe",
          role: "member",
          email: "john.doe@example.com",
          orgId: 99999,
          passwordHash: "hashedpassword",
        }),
      ).rejects.toMatchObject({ cause: { code: "23503" } });
    });

    it("rejects insert with an invalid role value", async () => {
      const fkOrg = await createTestOrg();

      await expect(
        repo.create({
          firstName: "John",
          lastName: "Doe",
          role: "superadmin",
          email: "john.doe@example.com",
          orgId: fkOrg[0].orgId,
          passwordHash: "hashedpassword",
        }),
      ).rejects.toMatchObject({ cause: { code: "22P02" } });
    });

    it("rejects duplicate email", async () => {
      const [org] = await createTestOrg();
      const base = {
        firstName: "John",
        lastName: "Doe",
        role: "member",
        email: "dupe@example.com",
        orgId: org.orgId,
        passwordHash: "hashedpassword",
      };
      await repo.create(base);
      await expect(
        repo.create({ ...base, firstName: "Jane" }),
      ).rejects.toMatchObject({
        cause: { code: "23505" },
      });
    });
  });

  describe("update", () => {
    it("updates and returns the user", async () => {
      const fkOrg = await createTestOrg();

      const [user] = await db
        .insert(users)
        .values({
          firstName: "John",
          lastName: "Doe",
          role: "member",
          email: "john.doe@example.com",
          orgId: fkOrg[0].orgId,
          passwordHash: "hashedpassword",
        })
        .returning();
      const result = await repo.update(user.userId, {
        firstName: "Jane",
        lastName: "Smith",
      });
      expect(result).toMatchObject({
        userId: user.userId,
        firstName: "Jane",
        lastName: "Smith",
        role: "member",
        email: "john.doe@example.com",
        orgId: fkOrg[0].orgId,
        passwordHash: "hashedpassword",
      });
    });

    it("returns undefined when attempting to update non-existent user", async () => {
      const result = await repo.update(99999, { firstName: "Jane" });
      expect(result).toBeUndefined();
    });
  });

  describe("remove", () => {
    it("deletes and returns the user", async () => {
      const fkOrg = await createTestOrg();

      const [user] = await db
        .insert(users)
        .values({
          firstName: "John",
          lastName: "Doe",
          role: "member",
          email: "john.doe@example.com",
          orgId: fkOrg[0].orgId,
          passwordHash: "hashedpassword",
        })
        .returning();
      const result = await repo.remove(user.userId);
      expect(result).toMatchObject({
        userId: user.userId,
        firstName: "John",
        lastName: "Doe",
        role: "member",
        email: "john.doe@example.com",
        orgId: fkOrg[0].orgId,
        passwordHash: "hashedpassword",
      });
      const check = await repo.findById(user.userId);
      expect(check).toBeUndefined();
    });

    it("returns undefined when trying to delete non-existent user", async () => {
      const result = await repo.remove(99999);
      expect(result).toBeUndefined();
    });
  });

  describe("cascade delete from organization", () => {
    it("removes users when their organization is deleted", async () => {
      const fkOrg = await createTestOrg();

      const [user] = await db
        .insert(users)
        .values({
          firstName: "John",
          lastName: "Doe",
          role: "member",
          email: "john.doe@example.com",
          orgId: fkOrg[0].orgId,
          passwordHash: "hashedpassword",
        })
        .returning();

      await db
        .delete(schema.organizations)
        .where(eq(schema.organizations.orgId, fkOrg[0].orgId));

      const result = await repo.findById(user.userId);
      expect(result).toBeUndefined();
    });
  });
});
