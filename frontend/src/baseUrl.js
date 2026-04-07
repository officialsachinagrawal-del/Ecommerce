const baseUrl =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV !== "production"
    ? "http://localhost:5000"
    : "https://ecommerce-api.onrender.com");

export default baseUrl;