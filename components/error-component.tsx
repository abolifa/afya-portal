import React from "react";

const ErrorComponent = ({ error }: { error: Error }) => {
  return <div>Error: {error.message}</div>;
};

export default ErrorComponent;
