import { pool } from "../config/database.js";

export async function findAll() {
  const result = await pool.query(
    "SELECT * FROM layout_templates ORDER BY layout_template_id ASC"
  );
  return result.rows;
}

export async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM layout_templates WHERE layout_template_id = $1",
    [id]
  );
  return result.rows[0];
}

export async function create(layout_template) {
  const {
    owner_tenant_id,
    name,
    description,
    created_by_user_id,
    template_config,
  } = layout_template;
  const result = await pool.query(
    `
        INSERT INTO layout_templates
        (owner_tenant_id, name, description, created_by_user_id, template_config)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
    [owner_tenant_id, name, description, created_by_user_id, template_config]
  );
  return result.rows[0];
}

export async function update(id, data) {
  const {
    owner_tenant_id,
    name,
    description,
    created_by_user_id,
    template_config,
  } = data;
  const result = await pool.query(
    `
    UPDATE layout_templates
    SET
        owner_tenant_id = $1,
        name = $2,
        description = $3,
        created_by_user_id = $4,
        template_config = $5
    WHERE layout_template_id = $6
    RETURNING *
    `,
    [
      owner_tenant_id,
      name,
      description,
      created_by_user_id,
      template_config,
      id,
    ]
  );
  return result.rows[0];
}

export async function remove(id) {
  return pool.query("DELETE FROM layout_templates WHERE tenant_id = $1", [id]);
}
