import { useState, useEffect } from "react";
import ApiDocs from "frontend/components/ApiDocs";
import config from "config";
import EntityCollection from "frontend/components/entity/Collection/EntityCollection";
import { useFromStore } from "hooks";

const API_DOCS_URL = `${config.services.api}/api/static/docs/v1/swagger.json`;

const adjustedSchema = schema => {
  const newSchema = { ...schema };
  delete newSchema.host;
  return newSchema;
};

const getEndpointCounts = schema => {
  if (!schema) return 0;
  let count = 0;
  Object.keys(schema.paths).forEach(path => {
    count += Object.keys(schema.paths[path]).length;
  });
  return count;
};

export default function Api() {
  const [schema, setSchema] = useState(null);
  const authentication = useFromStore({ path: "authentication" });

  useEffect(() => {
    fetch(API_DOCS_URL).then(response => {
      response.json().then(data => {
        setSchema(adjustedSchema(data));
      });
    });
  }, []);

  if (!schema) return null;

  const endpointCounts = getEndpointCounts(schema);

  return (
    <EntityCollection
      title={`Manifold API ${schema.info.version} Documentation`}
      icon="settings32"
      description={`
            <p className="description">
              Nearly all changes to data stored in a Manifold installation occur over
              Manifold's API with a base URL of <em>${config.services.api}${
        schema.basePath
      }</em>.
              The API is a <a href="https://en.wikipedia.org/wiki/Representational_state_transfer">
                REST API
              </a>
              with ${endpointCounts} distinct endpoints. It strives to conform to the
              <a href="https://jsonapi.org/">JSON:API</a> specification.
            </p>
            <p className="description">
              ${
                authentication.authenticated
                  ? `You are currently sending API requests as <strong>${authentication.currentUser.attributes.fullName}</strong>.`
                  : `<strong>You are not currently logged in.</strong>`
              }
              Any requests you send to this instance using the documentation below
              will be sent with your current authorization token and will operate on the current data for
              <a href="${config.services.api}">${
        config.services.api
      }</a> so proceed with caution.
            </p>
            <p className="description">
              Manifold's API documentation follows the <a href="https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md">
                OpenAPI ${schema.swagger}
              </a>
              specification. The JSON schema file for Manifold's API is available at
              <a target="top" href=${API_DOCS_URL}>
                ${API_DOCS_URL}
              </a>
            </p>
          `}
      headerLayout="title_description"
      BodyComponent={() => (
        <ApiDocs schema={schema} authToken={authentication.authToken} />
      )}
    />
  );
}
