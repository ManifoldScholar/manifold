import PropTypes from "prop-types";
import Slideshow from "components/frontend/resource-list/SlideShow/Fetcher";
import Title from "../Title";
import Description from "../Description";
import UserActions from "./UserActions";
import EditorActions from "./EditorActions";
import * as Styled from "components/frontend/resource/Preview/styles";

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
      <Slideshow resourceCollection={resourceCollection} />
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
