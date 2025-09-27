import PropTypes from "prop-types";
import Slideshow from "frontend/components/resource-list/SlideShow/Fetcher";
import Title from "../Title";
import Description from "../Description";
// import UserActions from "./UserActions";
// import EditorActions from "./EditorActions";
import * as Styled from "frontend/components/resource/Preview/styles";

function ResourcePreview({ resourceCollection, titleAs = "h2" }) {
  return (
    <Styled.Wrapper>
      <Title resourceCollection={resourceCollection} titleAs={titleAs} />
      <Description
        resource={resourceCollection}
        captionOnly
        className="resource-preview-description"
      />
      <Slideshow
        resourceCollection={resourceCollection}
        fetchKey={`reader-collection-slideshow-${resourceCollection.id}`}
      />
      {/* <Styled.Footer>
        <UserActions
          resource={resource}
          resourceCollection={resourceCollection}
          hideDetailLink={hideDetailLink}
        />
        <EditorActions resource={resource} />
      </Styled.Footer> */}
    </Styled.Wrapper>
  );
}

ResourcePreview.displayName = "Resource.Preview";

ResourcePreview.propTypes = {
  resourceCollection: PropTypes.object.isRequired,
  fetchKey: PropTypes.string.isRequired,
  titleAs: PropTypes.oneOf(["h1", "h2", "h3"])
};

export default ResourcePreview;
