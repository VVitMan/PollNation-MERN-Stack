export const errorCustom = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode|| 500; // Default to 500 if no statusCode is provided
    error.message = message || "Internal Server Error";
    return error;
}