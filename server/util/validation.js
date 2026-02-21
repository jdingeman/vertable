import { RequiredFieldError } from "../errors/index.js";

export function validateRequiredFields(obj, requiredFields) {
  const missingFields = requiredFields.filter(
    (field) =>
      obj[field] === undefined || obj[field] === null || obj[field] === ""
  );

  if (missingFields.length > 0) {
    throw new RequiredFieldError(
      `Missing required fields: ${missingFields.join(", ")}`
    );
  }
}
