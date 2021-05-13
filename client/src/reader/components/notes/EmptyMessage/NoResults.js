import React from "react";
import Template from "./Template";

const NoResults = () => (
  <Template
    title="No annotations found"
    body="No annotations match the filters set above. Adjust the filters
    to show more results."
  />
);

export default NoResults;
