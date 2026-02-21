import { pool } from "../config/database.js";

export async function findAll() {
  const result = await pool.query("SELECT * FROM users ORDER BY user_id ASC");
  return result.rows;
}

export async function findById(id) {
  const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    id,
  ]);
  return result.rows[0];
}

export async function create(user) {
  const {
    tenant_id,
    first_name,
    last_name,
    email,
    password_hash,
    is_superuser,
  } = user;
  const result = await pool.query(
    `
        INSERT INTO users
        (tenant_id, first_name, last_name, email, password_hash, is_superuser)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
    [tenant_id, first_name, last_name, email, password_hash, is_superuser]
  );
  return result.rows[0];
}

export async function update(id, data) {
  const {
    tenant_id,
    first_name,
    last_name,
    email,
    password_hash,
    is_superuser,
  } = data;
  const result = await pool.query(
    `
    UPDATE users
    SET
        tenant_id = $1,
        first_name = $2, 
        last_name = $3, 
        email = $4, 
        password_hash = $5,
        is_superuser = $6
    WHERE user_id = $7
    RETURNING *
    `,
    [tenant_id, first_name, last_name, email, password_hash, is_superuser, id]
  );
  return result.rows[0];
}

export async function remove(d) {
  return pool.query("DELETE FROM users WHERE user_id = $1", [id]);
}
