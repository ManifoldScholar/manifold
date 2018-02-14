import React, { Component } from "react";
import PropTypes from "prop-types";
import { Text } from "components/frontend";

export default class TestListPublished extends Component {
  static displayName = "TextList.Published";

  static propTypes = {
    text: PropTypes.object
  };

  render() {
    return (
      <nav className="text-category">
        <section>
          <h4 className="sub-section-heading">{"Published Version"}</h4>
          <ul className="texts-group">
            <li>
              <Text.Thumbnail text={this.props.text} />
            </li>
          </ul>
        </section>
      </nav>
    );
  }
}
