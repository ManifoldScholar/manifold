import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function HeadingTitle({ title, icon = "readingGroup24" }) {
  return (
    <Styled.TextContainer>
      <Styled.Icon icon={icon} size={32} />
      <Styled.Title className="heading-primary ">{title}</Styled.Title>
    </Styled.TextContainer>
  );
}

HeadingTitle.displayName = "ReadingGroup.Heading.Title";

HeadingTitle.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string
};

export default HeadingTitle;
