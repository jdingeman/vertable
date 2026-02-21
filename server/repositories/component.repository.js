import { pool } from "../config/database.js";

export async function findAll() {
  const result = await pool.query(
    "SELECT * FROM components ORDER BY component_id ASC"
  );
  return result.rows;
}

export async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM components WHERE component_id = $1",
    [id]
  );
  return result.rows[0];
}

export async function create(component) {
  const { component_key, display_name, default_config } = component;
  const result = await pool.query(
    `
        INSERT INTO components
        (component_key, display_name, default_config)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
    [component_key, display_name, default_config]
  );
  return result.rows[0];
}

export async function update(id, data) {
  const { component_key, display_name, default_config } = data;
  const result = await pool.query(
    `
    UPDATE components
    SET
        component_type = $1,
        display_name = $2,
        default_config
    WHERE component_id = $3
    RETURNING *
    `,
    [component_key, display_name, default_config, id]
  );
  return result.rows[0];
}

export async function remove(id) {
  return pool.query("DELETE FROM components WHERE component_id = $1", [id]);
}
