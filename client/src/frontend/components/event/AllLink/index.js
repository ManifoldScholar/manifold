import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "global/components/atomic/Button";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

export default function EventAllLink({ threshold, entity }) {
  const { t } = useTranslation();

  if (entity.attributes.eventCount <= threshold) return null;

  return (
    <Styled.Wrapper>
      <Button
        as={Link}
        label={t("navigation.see_all_activity")}
        to={lh.link("frontendProjectEvents", entity.attributes.slug)}
        size="lg"
        background="outline-accent"
      />
    </Styled.Wrapper>
  );
}

EventAllLink.displayName = "Event.AllLink";

EventAllLink.propTypes = {
  threshold: PropTypes.number.isRequired,
  entity: PropTypes.object.isRequired
};
