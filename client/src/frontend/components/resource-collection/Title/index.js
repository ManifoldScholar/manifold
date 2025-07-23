import PropTypes from "prop-types";
import Collecting from "frontend/components/collecting";
import Badge from "../Badge";
import * as Styled from "./styles";

function ResourceCollectionTitle({ resourceCollection, titleAs = "h1" }) {
  const {
    titleFormatted,
    collectionResourcesCount
  } = resourceCollection.attributes;

  return (
    <Styled.Container>
      <Styled.TitleAndToggle>
        <Styled.Title
          as={titleAs}
          dangerouslySetInnerHTML={{ __html: titleFormatted }}
        />
        <Styled.ToggleWrapper>
          <Collecting.Toggle collectable={resourceCollection} />
        </Styled.ToggleWrapper>
      </Styled.TitleAndToggle>
      <Badge resourceCount={collectionResourcesCount} />
    </Styled.Container>
  );
}

ResourceCollectionTitle.displayName = "Resource.Title";

ResourceCollectionTitle.propTypes = {
  resourceCollection: PropTypes.object.isRequired,
  titleAs: PropTypes.oneOf(["h1", "h2", "h3"])
};

export default ResourceCollectionTitle;
