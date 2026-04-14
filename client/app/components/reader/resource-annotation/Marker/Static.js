import PropTypes from "prop-types";
import IconComposer from "components/global/utility/IconComposer";
import capitalize from "lodash/capitalize";
import useLoaderCollection from "hooks/useLoaderCollection";
import * as Styled from "./styles";

export default function StaticMarker({ annotation }) {
  const resources = useLoaderCollection("resources");
  const resourceCollections = useLoaderCollection("resource_collections");
  const { resourceId, resourceCollectionId } = annotation;

  const resource = resources.find(r => r.id === resourceId);
  const collection = resourceCollections.find(
    c => c.id === resourceCollectionId
  );

  /* eslint-disable no-nested-ternary */
  const kind = resource
    ? resource.attributes.kind
    : collection
    ? "collection"
    : "file";

  return (
    <Styled.Marker as="span" $static>
      <IconComposer size={20} icon={`resource${capitalize(kind)}64`} />
    </Styled.Marker>
  );
}

StaticMarker.propTypes = {
  annotation: PropTypes.object
};

StaticMarker.displayName = "ResourceAnnotation.Marker.Static";
