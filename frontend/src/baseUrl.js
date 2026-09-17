const baseUrl =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV !== "production"
    ? "http://localhost:5004"
    : "");

export default baseUrl;