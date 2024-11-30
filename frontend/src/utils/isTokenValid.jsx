/**
 * Checks if a JWT token is valid and not expired.
 * @param {string} token - The token to validate.
 * @returns {boolean} - True if the token is valid, false otherwise.
 */
export const isTokenValid = (token) => {
  if (!token) {
    console.warn("No token provided.");
    return false;
  }

  try {
    // Split the token into parts and decode the payload
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (!payload.exp) {
      console.warn("Invalid token structure. Missing expiration.");
      return false;
    }

    const currentTime = Date.now() / 1000; // Current time in seconds
    if (payload.exp < currentTime) {
      console.warn("Token has expired.");
      return false;
    }

    return true; // Token is valid
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};
