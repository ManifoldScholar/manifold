import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

export default class EventAllLink extends Component {
  static displayName = "Event.AllLink";

  static propTypes = {
    threshold: PropTypes.number.isRequired,
    entity: PropTypes.object.isRequired
  };

  render() {
    const { entity, threshold } = this.props;

    if (entity.attributes.eventCount <= threshold) return null;

    return (
      <Styled.Wrapper>
        <Link
          to={lh.link("frontendProjectEvents", entity.attributes.slug)}
          className="button-primary"
        >
          <span className="button-primary__text">See all Activity</span>
        </Link>
      </Styled.Wrapper>
    );
  }
}
