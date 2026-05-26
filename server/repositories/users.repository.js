import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function findAll() {
  const result = await db.select().from(users).orderBy(users.userId);
  return result;
}

export async function findById(id) {
  const [result] = await db.select().from(users).where(eq(users.userId, id));
  return result;
}

export async function create(user) {
  const [result] = await db.insert(users).values(user).returning();
  return result;
}

export async function update(id, data) {
  const [result] = await db
    .update(users)
    .set(data)
    .where(eq(users.userId, id))
    .returning();
  return result;
}

export async function remove(id) {
  const [result] = await db
    .delete(users)
    .where(eq(users.userId, id))
    .returning();
  return result;
}
