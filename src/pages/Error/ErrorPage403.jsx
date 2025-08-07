import React from "react";
import { Link } from "react-router-dom";

function ErrorPage403() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-3xl text-blue-600 lg:text-6xl">403</h1>

          <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
            You are not authorized.
          </h6>

          <p className="mb-4 text-center text-gray-500 md:text-lg">
            You tried to access a page you did not have prior authorization for.
          </p>

          <Link
            to="/"
            className="px-5 py-2 rounded-md text-blue-100 bg-blue-600 hover:bg-blue-700"
          >
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage403;
