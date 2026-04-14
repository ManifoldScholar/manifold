import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";
import { useTranslation } from "react-i18next";

function HeadingTitle({
  title,
  icon = "readingGroup24",
  tag,
  adminWarning = false
}) {
  const { t } = useTranslation();

  return (
    <Styled.TextContainer>
      <Styled.Icon icon={icon} size={32} />
      <Styled.Title className="heading-primary ">
        {title}
        {adminWarning && (
          <Styled.Warning>
            {t("messages.reading_group.admin_warning")}
          </Styled.Warning>
        )}
      </Styled.Title>
      {tag && <Styled.Tag>{tag}</Styled.Tag>}
    </Styled.TextContainer>
  );
}

HeadingTitle.displayName = "ReadingGroup.Heading.Title";

HeadingTitle.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  tag: PropTypes.string,
  adminWarning: PropTypes.bool
};

export default HeadingTitle;
