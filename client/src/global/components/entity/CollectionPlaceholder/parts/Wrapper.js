import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

const PlaceholderWrapper = ({ bgColor, style = {}, children }) => {
  const Container = ({ children: containerChildren }) =>
    !bgColor ? (
      <section style={style}>{containerChildren}</section>
    ) : (
      <section className={`bg-${bgColor}`} style={style}>
        <div className="container">{containerChildren}</div>
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

PlaceholderWrapper.displayName = "Global.Entity.CollectionPlaceholder.Wrapper";

export default PlaceholderWrapper;
