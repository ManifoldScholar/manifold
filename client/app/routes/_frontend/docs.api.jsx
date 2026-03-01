import { routerContext } from "app/contexts";
import ApiDocs from "frontend/components/ApiDocs";
import config from "config";
import EntityCollection from "frontend/components/entity/Collection/EntityCollection";
import { useAuthentication } from "hooks";
import HeadContent from "global/components/HeadContent";

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

export const loader = async ({ context }) => {
  const { auth } = context.get(routerContext) ?? {};

  try {
    const response = await fetch(API_DOCS_URL);
    const schema = await response.json();
    return { schema: adjustedSchema(schema), authToken: auth?.authToken };
  } catch (error) {
    console.error("Failed to fetch API docs:", error);
    return { schema: null, authToken: auth?.authToken };
  }
};

export default function ApiDocsRoute({ loaderData }) {
  const { schema, authToken } = loaderData || {};
  const { authenticated, currentUser } = useAuthentication();

  if (!schema) return null;

  const endpointCounts = getEndpointCounts(schema);

  return (
    <>
      <HeadContent
        title={`Manifold API ${schema.info.version} Documentation`}
        appendDefaultTitle
      />
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
                authenticated
                  ? `You are currently sending API requests as <strong>${currentUser?.attributes?.fullName}</strong>.`
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
        BodyComponent={() => <ApiDocs schema={schema} authToken={authToken} />}
      />
    </>
  );
}
