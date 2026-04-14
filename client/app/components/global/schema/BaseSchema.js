import React from "react";
import PropTypes from "prop-types";

export default function BaseSchema({ entity }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    mainEntity: entity
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  );
}

BaseSchema.displayName = "Schema.Base";

BaseSchema.propTypes = {
  entity: PropTypes.object.isRequired
};
