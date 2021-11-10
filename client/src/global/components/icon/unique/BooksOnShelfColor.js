import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class SVGBooksOnShelfColor extends Component {
  static displayName = "SVG.BooksOnShelfColor";

  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.number
  };

  get width() {
    return this.props.size || null;
  }

  get height() {
    return this.props.size * 0.52 || null;
  }

  render() {
    const classes = classnames("manicon-svg", this.props.className);

    return (
      <svg
        className={classes}
        xmlns="http://www.w3.org/2000/svg"
        width={this.width}
        height={this.height}
        viewBox="0 0 122.6 63.8"
        aria-hidden="true"
      >
        <path
          fill="#cbf7e6"
          d="M28.5 10.6h14.3v44.7H28.5V10.6zm0 46.4h14.3v5.1H28.5V57zm0-53.2h14.3v5.1H28.5V3.8zm64.4 55.9L83.9 2 69.8 4.2l8.9 57.7 14.2-2.2zm-16.4-27c-.4-2.7 1.4-5.2 4.1-5.6s5.2 1.4 5.6 4.1-1.4 5.2-4.1 5.6c-.3 0-.5.1-.8.1-2.4-.1-4.5-1.8-4.8-4.2zM50 52.3h14.3v3H50v-3zm0 4.7h14.3v5.1H50V57zm0-53.2h14.3v5.1H50V3.8zm0 6.8h14.3v3H50v-3zm0 4.8h14.3v35.2H50V15.4z"
        />
        <path
          fill="#c3c3c3"
          d="M82.1 36.8c2.7-.4 4.5-2.9 4.1-5.6s-2.9-4.5-5.6-4.1-4.5 2.9-4.1 5.6c.4 2.4 2.5 4.1 4.8 4.1h.8zm-1.3-8h.5c1.5 0 2.9 1.1 3.1 2.7.3 1.7-.9 3.3-2.6 3.6-1.7.3-3.3-.9-3.6-2.6-.3-1.8.9-3.4 2.6-3.7zm40.9 33.3H88.5l5.5-.9c.2 0 .4-.2.6-.3.1-.2.2-.4.2-.7L85.5.8c0-.2-.2-.4-.3-.6-.2-.1-.4-.1-.7-.1L68.6 2.6c-.5.1-.8.5-.7 1L77 62.1H66V2.9c0-.5-.4-.9-.9-.9h-16c-.5 0-.9.4-.9.9v59.2h-3.6V2.9c0-.5-.4-.9-.9-.9H27.6c-.5 0-.9.4-.9.9v59.2H.9c-.5 0-.9.4-.9.9s.4.9.9.9h121c.5 0 .9-.4.9-.9s-.6-.9-1.1-.9zM83.9 2l8.9 57.7-14.2 2.2-8.8-57.7L83.9 2zM64.3 50.5H50V15.4h14.3v35.1zm0-41.7H50v-5h14.3v5zm0 1.8v3H50v-3h14.3zM50 52.3h14.3v3H50v-3zm0 4.7h14.3v5.1H50V57zm-7.2-1.7H28.5V10.6h14.3v44.7zm0-51.5v5.1H28.5V3.8h14.3zM28.5 57h14.3v5.1H28.5V57z"
        />
      </svg>
    );
  }
}
