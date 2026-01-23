/**
 * Extract field-level errors from API error response
 * @param {Object|string} error - Error object from API response
 * @returns {Object} Object with field names as keys and error messages as values
 */
export function extractFieldErrors(error) {
  if (!error) return {};

  // If error is a string, return empty object (no field-specific errors)
  if (typeof error === "string") return {};

  // If error has details array, convert to object
  if (error.details && Array.isArray(error.details)) {
    const fieldErrors = {};
    error.details.forEach((detail) => {
      if (detail.field && detail.message) {
        fieldErrors[detail.field] = detail.message;
      }
    });
    return fieldErrors;
  }

  return {};
}

/**
 * Get only the main error message without field details
 * @param {Object|string} error - Error object from API response
 * @returns {string|null} Main error message or null
 */
export function getMainErrorMessage(error) {
  if (!error) return null;

  // If error is a string, return it
  if (typeof error === "string") return error;

  // If error has message and details, only return message if there are no field-specific details
  // This prevents showing "Validation Error" when field errors are displayed
  if (error.message && error.details && Array.isArray(error.details) && error.details.length > 0) {
    return null; // Don't show general message when we have field errors
  }

  // Return the message if it exists
  return error.message || null;
}
