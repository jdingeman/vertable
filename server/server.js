import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import tenantRouter from "./routes/tenant.route.js";
import userRouter from "./routes/user.route.js";
import componentRouter from "./routes/component.route.js";
import layoutTemplateRouter from "./routes/layoutTemplate.route.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.use(express.json());

app.use("/tenants", tenantRouter);
app.use("/users", userRouter);
app.use("/components", componentRouter);
app.use("/layout_templates", layoutTemplateRouter);

// Not found fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
