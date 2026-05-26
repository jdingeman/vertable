import { db } from "../db/index.js";
import { organizations } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function findAll() {
  const result = await db
    .select()
    .from(organizations)
    .orderBy(organizations.orgId);
  return result;
}

export async function findById(id) {
  const [result] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.orgId, id));
  return result;
}

export async function create(organization) {
  const { name } = organization;
  const [result] = await db.insert(organizations).values({ name }).returning();
  return result;
}

export async function update(id, data) {
  const { name } = data;
  const [result] = await db
    .update(organizations)
    .set({ name })
    .where(eq(organizations.orgId, id))
    .returning();
  return result;
}

export async function remove(id) {
  const [result] = await db
    .delete(organizations)
    .where(eq(organizations.orgId, id))
    .returning();
  return result;
}
