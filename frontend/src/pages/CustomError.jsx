import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function CustomError() {
  const location = useLocation();
  const error = location.state?.error || "An unknown error occurred";

  return (
    <div className="error-page">
      <h1>Error</h1>
      <h2>{error}</h2>
      <Link to="/">Back to Home page</Link>
    </div>
  );
}
