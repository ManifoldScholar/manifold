import PropTypes from "prop-types";
import Title from "../Title";
import Hero from "../Hero";
import Description from "../Description";
import UserActions from "./UserActions";
import * as Styled from "./styles";

function ResourcePreview({ resource }) {
  return (
    <Styled.Wrapper>
      <Title resource={resource} titleAs="h2" />
      <Hero resource={resource} />
      <Description
        resource={resource}
        captionOnly
        className="resource-preview-description"
      />
      <Styled.Footer>
        <UserActions resource={resource} />
      </Styled.Footer>
    </Styled.Wrapper>
  );
}

ResourcePreview.displayName = "Resource.Preview";

ResourcePreview.propTypes = {
  resource: PropTypes.object.isRequired
};

export default ResourcePreview;
