import PropTypes from "prop-types";
import Title from "../Title";
import MediaFactory from "../media/Factory";
import Description from "../Description";
import UserActions from "./UserActions";
import EditorActions from "./EditorActions";
import * as Styled from "./styles";

function ResourcePreview({
  resource,
  resourceCollection,
  titleAs = "h2",
  hideDetailLink,
  textId
}) {
  return (
    <Styled.Wrapper>
      <Title resource={resource} titleAs={titleAs} />
      <MediaFactory resource={resource} roundedCorners />
      <Description
        resource={resource}
        captionOnly
        className="resource-preview-description"
      />
      <Styled.Footer>
        <UserActions
          resource={resource}
          resourceCollection={resourceCollection}
          hideDetailLink={hideDetailLink}
        />
        <EditorActions resource={resource} textId={textId} />
      </Styled.Footer>
    </Styled.Wrapper>
  );
}

ResourcePreview.displayName = "Resource.Preview";

ResourcePreview.propTypes = {
  resource: PropTypes.object.isRequired,
  resourceCollection: PropTypes.object,
  titleAs: PropTypes.oneOf(["h1", "h2", "h3"]),
  hideDetailLink: PropTypes.bool,
  textId: PropTypes.string
};

export default ResourcePreview;
