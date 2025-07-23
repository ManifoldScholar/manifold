import PropTypes from "prop-types";
import Collecting from "frontend/components/collecting";
import Badge from "../Badge";
import * as Styled from "./styles";

function ResourceTitle({ resource, titleAs = "h1", hideBadge = false }) {
  const { kind, titleFormatted } = resource.attributes;

  return (
    <Styled.Container>
      <Styled.TitleAndToggle>
        <Styled.Title
          as={titleAs}
          dangerouslySetInnerHTML={{ __html: titleFormatted }}
        />
        <Styled.ToggleWrapper>
          <Collecting.Toggle collectable={resource} />
        </Styled.ToggleWrapper>
      </Styled.TitleAndToggle>
      {!hideBadge && <Badge kind={kind} />}
    </Styled.Container>
  );
}

ResourceTitle.displayName = "Resource.Title";

ResourceTitle.propTypes = {
  resource: PropTypes.object.isRequired,
  titleAs: PropTypes.oneOf(["h1", "h2", "h3"]),
  hideBadge: PropTypes.bool
};

export default ResourceTitle;
