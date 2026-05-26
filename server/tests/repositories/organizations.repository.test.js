import "dotenv/config";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { reset } from "drizzle-seed";
import { db } from "../../db/index.js";
import { organizations } from "../../db/schema.js";
import * as schema from "../../db/schema.js";
import * as repo from "../../repositories/organizations.repository.js";

beforeEach(async () => {
  await reset(db, schema);
});

afterAll(async () => {
  await reset(db, schema);
});

describe("organizations repository", () => {
  describe("findAll", () => {
    it("returns empty array when no organizations exist", async () => {
      const result = await repo.findAll();
      expect(result).toEqual([]);
    });

    it("returns all organizations", async () => {
      const inserted = await db
        .insert(organizations)
        .values([{ name: "Acme Corp" }, { name: "Globex" }])
        .returning();
      const result = await repo.findAll();
      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining(inserted));
    });
  });

  describe("findById", () => {
    it("returns the organization when found", async () => {
      const [org] = await db
        .insert(organizations)
        .values({ name: "Acme Corp" })
        .returning();
      const result = await repo.findById(org.orgId);
      expect(result).toMatchObject({ orgId: org.orgId, name: "Acme Corp" });
    });

    it("returns undefined when not found", async () => {
      const result = await repo.findById(99999);
      expect(result).toBeUndefined();
    });
  });

  describe("create", () => {
    it("inserts and returns the new organization", async () => {
      const result = await repo.create({ name: "New Corp" });
      expect(result).toMatchObject({ name: "New Corp" });
      expect(result.orgId).toBeDefined();
    });
  });

  describe("update", () => {
    it("updates and returns the organization", async () => {
      const [org] = await db
        .insert(organizations)
        .values({ name: "Old Name" })
        .returning();
      const result = await repo.update(org.orgId, { name: "New Name" });
      expect(result).toMatchObject({ orgId: org.orgId, name: "New Name" });
    });
  });

  describe("remove", () => {
    it("deletes and returns the organization", async () => {
      const [org] = await db
        .insert(organizations)
        .values({ name: "To Delete" })
        .returning();
      const result = await repo.remove(org.orgId);
      expect(result).toMatchObject({ orgId: org.orgId });
      const check = await repo.findById(org.orgId);
      expect(check).toBeUndefined();
    });
  });
});
