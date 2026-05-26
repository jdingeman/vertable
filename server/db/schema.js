import { isNull } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  integer,
  varchar,
  boolean,
  index,
  primaryKey,
  unique,
  uniqueIndex,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "member"]);

export const orgRoleEnum = pgEnum("organization_role", ["vendor", "client"]);

export const relationshipStatusEnum = pgEnum("relationship_status", [
  "pending",
  "active",
  "terminated",
]);

export const organizations = pgTable("organizations", {
  orgId: integer("organization_id")
    .notNull()
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const users = pgTable(
  "users",
  {
    userId: integer("user_id")
      .notNull()
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    orgId: integer("organization_id")
      .notNull()
      .references(() => organizations.orgId, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    role: userRoleEnum("role").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [index("users_org_id_idx").on(table.orgId)],
);

export const orgRoles = pgTable(
  "organization_roles",
  {
    orgId: integer("organization_id")
      .notNull()
      .references(() => organizations.orgId, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    role: orgRoleEnum("role").notNull(),
  },
  (table) => [primaryKey({ columns: [table.orgId, table.role] })],
);

export const vendorClientRelationships = pgTable(
  "vendor_client_relationships",
  {
    relationshipId: integer("relationship_id")
      .notNull()
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    vendorOrgId: integer("vendor_org_id")
      .notNull()
      .references(() => organizations.orgId, {
        onUpdate: "cascade",
        onDelete: "restrict",
      }),
    clientOrgId: integer("client_org_id")
      .notNull()
      .references(() => organizations.orgId, {
        onUpdate: "cascade",
        onDelete: "restrict",
      }),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    status: relationshipStatusEnum("status").notNull().default("pending"),
  },
  (table) => [
    unique().on(table.vendorOrgId, table.clientOrgId),
    index("vcr_vendor_org_id_idx").on(table.vendorOrgId),
    index("vcr_client_org_id_idx").on(table.clientOrgId),
  ],
);

export const dashboards = pgTable("dashboards", {
  dashboardId: integer("dashboard_id")
    .notNull()
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  relationshipId: integer("relationship_id")
    .notNull()
    .unique()
    .references(() => vendorClientRelationships.relationshipId, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const dashboardWidgets = pgTable(
  "dashboard_widgets",
  {
    widgetId: integer("widget_id")
      .notNull()
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    dashboardId: integer("dashboard_id")
      .notNull()
      .references(() => dashboards.dashboardId, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    widgetType: varchar("widget_type", { length: 50 }).notNull(),
    createdByUserId: integer("created_by_user_id")
      .notNull()
      .references(() => users.userId, {
        onUpdate: "cascade",
        onDelete: "restrict",
      }),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    title: varchar("title", { length: 255 }),
    isVisibleToClient: boolean("is_visible_to_client").notNull().default(true),
    isEditableByClient: boolean("is_editable_by_client")
      .notNull()
      .default(false),
    isLayoutLocked: boolean("is_layout_locked").notNull().default(true),
    gridX: integer("grid_x").notNull(),
    gridY: integer("grid_y").notNull(),
    gridWidth: integer("grid_w").notNull(),
    gridHeight: integer("grid_h").notNull(),
    minWidth: integer("min_w"),
    minHeight: integer("min_h"),
    maxWidth: integer("max_w"),
    maxHeight: integer("max_h"),
    clientGridX: integer("client_grid_x"),
    clientGridY: integer("client_grid_y"),
    clientGridWidth: integer("client_grid_w"),
    clientGridHeight: integer("client_grid_h"),
    config: jsonb("config").notNull().default({}),
  },
  (table) => [
    index("dashboard_widgets_dashboard_id_idx").on(table.dashboardId),
    index("dashboard_widgets_created_by_user_id_idx").on(table.createdByUserId),
  ],
);

export const invitations = pgTable(
  "invitations",
  {
    invitationId: integer("invitation_id")
      .notNull()
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    orgId: integer("org_id")
      .notNull()
      .references(() => organizations.orgId, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    email: varchar("email", { length: 255 }).notNull(),
    role: userRoleEnum("role").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at", {
      precision: 6,
      withTimezone: true,
    }).notNull(),
    acceptedAt: timestamp("accepted_at", { precision: 6, withTimezone: true }),
    invitedByUserId: integer("invited_by_user_id").references(
      () => users.userId,
      {
        onUpdate: "cascade",
        onDelete: "set null",
      },
    ),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("invitations_org_id_idx").on(table.orgId),
    index("invitations_invited_by_user_id_idx").on(table.invitedByUserId),
    uniqueIndex("unique_pending_invitation")
      .on(table.orgId, table.email)
      .where(isNull(table.acceptedAt)),
  ],
);

export const widgetTemplates = pgTable(
  "widget_templates",
  {
    templateId: integer("template_id")
      .notNull()
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    ownerOrgId: integer("owner_org_id")
      .notNull()
      .references(() => organizations.orgId, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    widgetType: varchar("widget_type", { length: 50 }).notNull(),
    title: varchar("title", { length: 255 }),
    config: jsonb("config").notNull().default({}),
    createdByUserId: integer("created_by_user_id").references(
      () => users.userId,
      {
        onUpdate: "cascade",
        onDelete: "set null",
      },
    ),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("widget_templates_owner_org_id_idx").on(table.ownerOrgId),
    index("widget_templates_created_by_user_id_idx").on(table.createdByUserId),
  ],
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    tokenId: integer("token_id")
      .notNull()
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.userId, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    resetToken: varchar("reset_token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at", {
      precision: 6,
      withTimezone: true,
    }).notNull(),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    usedAt: timestamp("used_at", { precision: 6, withTimezone: true }),
  },
  (table) => [index("password_reset_tokens_user_id_idx").on(table.userId)],
);
