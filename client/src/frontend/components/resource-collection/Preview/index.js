import PropTypes from "prop-types";
import Slideshow from "frontend/components/resource-list/SlideShow/Fetcher";
import Title from "../Title";
import Description from "../Description";
import UserActions from "./UserActions";
import EditorActions from "./EditorActions";
import * as Styled from "frontend/components/resource/Preview/styles";

function ResourceCollectionPreview({
  resourceCollection,
  titleAs = "h2",
  textId,
  destroyAnnotation
}) {
  return (
    <Styled.Wrapper>
      <Title resourceCollection={resourceCollection} titleAs={titleAs} />
      <Description
        description={resourceCollection.attributes.descriptionFormatted}
      />
      <Slideshow
        resourceCollection={resourceCollection}
        fetchKey={`reader-collection-slideshow-${resourceCollection.id}`}
      />
      <Styled.Footer>
        <UserActions resourceCollection={resourceCollection} />
        <EditorActions
          resourceCollection={resourceCollection}
          textId={textId}
          destroyAnnotation={destroyAnnotation}
        />
      </Styled.Footer>
    </Styled.Wrapper>
  );
}

ResourceCollectionPreview.displayName = "ResourceCollection.Preview";

ResourceCollectionPreview.propTypes = {
  resourceCollection: PropTypes.object.isRequired,
  titleAs: PropTypes.oneOf(["h1", "h2", "h3"]),
  textId: PropTypes.string,
  destroyAnnotation: PropTypes.func
};

export default ResourceCollectionPreview;
