import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default class GroupNavButtons extends React.PureComponent {
  static propTypes = {
    links: PropTypes.array
  };

  get buttonClassNames() {
    return "group-page-heading__nav-button";
  }

  render() {
    const { links } = this.props;
    if (!links || links.length === 0) return null;
    return (
      <div className={"group-page-heading__button-container"}>
        {links.map(link => {
          let Wrapper;
          let wrapperProps;

          if (link.to) {
            Wrapper = Link;
            wrapperProps = { to: link.to };
          } else {
            Wrapper = "button";
            wrapperProps = { onClick: link.onClick, type: "button" };
          }

          return (
            <Wrapper
              key={link.text}
              className={this.buttonClassNames}
              {...wrapperProps}
            >
              {link.text}
            </Wrapper>
          );
        })}
      </div>
    );
  }
}
