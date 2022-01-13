import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

const PlaceholderWrapper = ({ bgColor, style = {}, children }) => {
  const Container = ({ children }) =>
    !bgColor ? (
      <section>{children}</section>
    ) : (
      <section className={`bg-${bgColor}`} style={style}>
        <div className="container">{children}</div>
      </section>
    );

  return (
    <Container>
      <Styled.Wrapper>
        <Styled.Inner>{children}</Styled.Inner>
      </Styled.Wrapper>
    </Container>
  );
};

PlaceholderWrapper.propTypes = {
  bgColor: PropTypes.oneOf(["white", "neutral05"]),
  style: PropTypes.object
};

PlaceholderWrapper.displayName =
  "Global.Composed.EntityCollectionPlaceholder.Wrapper";

export default PlaceholderWrapper;
