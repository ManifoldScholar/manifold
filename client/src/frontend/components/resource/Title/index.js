import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Collecting from "frontend/components/collecting";
import Badge from "../Badge";
import * as Styled from "./styles";

function ResourceTitle({ resource, titleAs = "h1" }) {
  const { t } = useTranslation();

  const { kind, titleFormatted, createdAt } = resource.attributes;

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
      <Badge kind={kind} />
    </Styled.Container>
  );
}

ResourceTitle.displayName = "Resource.Title";

ResourceTitle.propTypes = {
  resource: PropTypes.object.isRequired,
  titleAs: PropTypes.oneOf(["h1", "h2"])
};

export default ResourceTitle;
