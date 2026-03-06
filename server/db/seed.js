import { db } from "./index.js";
import { seed } from "drizzle-seed";
import * as schema from "./schema.js";

await seed(db, schema);
