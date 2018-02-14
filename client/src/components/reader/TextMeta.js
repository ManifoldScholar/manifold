import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { MetaList } from "components/global";

export default class TextMeta extends PureComponent {
  static displayName = "Reader.TextMeta";

  static propTypes = {
    title: PropTypes.string,
    meta: PropTypes.object,
    subtitle: PropTypes.string
  };

  render() {
    return (
      <div className="reader-text-meta">
        <header>
          <h2 className="title">{this.props.title}</h2>
          {this.props.subtitle ? (
            <p className="subtitle">{this.props.subtitle}</p>
          ) : null}
        </header>
        <MetaList metadata={this.props.meta} />
      </div>
    );
  }
}
