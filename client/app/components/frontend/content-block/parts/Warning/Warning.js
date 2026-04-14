import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function ContentBlockWarning({ icon, heading, body, note, className }) {
  return (
    <Styled.Wrapper className={className}>
      <Styled.Icon icon={icon} size={54} />
      <Styled.Content>
        <Styled.Heading>{heading}</Styled.Heading>
        <Styled.Body>
          <Styled.Message>{body}</Styled.Message>
          {note && <Styled.Note>{note}</Styled.Note>}
        </Styled.Body>
      </Styled.Content>
    </Styled.Wrapper>
  );
}

ContentBlockWarning.displayName = "ContentBlock.Warning";

ContentBlockWarning.propTypes = {
  icon: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  body: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.element
  ]).isRequired,
  note: PropTypes.string,
  className: PropTypes.string
};

export default ContentBlockWarning;
