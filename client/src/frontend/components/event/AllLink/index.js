import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

export default function EventAllLink({ threshold, entity }) {
  const { t } = useTranslation();

  if (entity.attributes.eventCount <= threshold) return null;

  return (
    <Styled.Wrapper>
      <Link
        to={lh.link("frontendProjectEvents", entity.attributes.slug)}
        className="button-primary"
      >
        <span className="button-primary__text">
          {t("navigation.see_all_activity")}
        </span>
      </Link>
    </Styled.Wrapper>
  );
}

EventAllLink.displayName = "Event.AllLink";

EventAllLink.propTypes = {
  threshold: PropTypes.number.isRequired,
  entity: PropTypes.object.isRequired
};
