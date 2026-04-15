import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import capitalize from "lodash/capitalize";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function StaticMarker({ annotation }) {
  const { resourceId, resourceCollectionId } = annotation;

  const resource = useFromStore({
    path: `entityStore.entities.resources["${resourceId}"]`
  });
  const collection = useFromStore({
    path: `entityStore.entities.resourceCollections["${resourceCollectionId}"]`
  });

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
