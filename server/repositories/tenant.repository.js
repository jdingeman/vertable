import { pool } from "../config/database.js";

export async function findAll() {
  const result = await pool.query(
    "SELECT * FROM tenants ORDER BY tenant_id ASC"
  );
  return result.rows;
}

export async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM tenants WHERE tenant_id = $1",
    [id]
  );
  return result.rows[0];
}

export async function create(tenant) {
  const { name, tenant_type } = tenant;
  const result = await pool.query(
    `
        INSERT INTO tenants
        (name, tenant_type)
        VALUES ($1, $2)
        RETURNING *
        `,
    [name, tenant_type]
  );
  return result.rows[0];
}

export async function update(id, data) {
  const { name, tenant_type } = data;
  const result = await pool.query(
    `
    UPDATE tenants
    SET
        name = $1,
        tenant_type = $2
    WHERE tenant_id = $3
    RETURNING *
    `,
    [name, tenant_type, id]
  );
  return result.rows[0];
}

export async function remove(id) {
  return pool.query("DELETE FROM tenants WHERE tenant_id = $1", [id]);
}
