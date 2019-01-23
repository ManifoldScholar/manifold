import React, { Component } from "react";
import PropTypes from "prop-types";
import Heading from "../../parts/Heading";

export default class TextsBlockHeader extends Component {
  static displayName = "TextsBlock.Header";

  static propTypes = {
    block: PropTypes.object.isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
    baseClass: PropTypes.string
  };

  static defaultProps = {
    baseClass: "text-header"
  };

  get blockDescription() {
    return this.props.block.attributes.descriptionFormatted;
  }

  render() {
    return (
      <React.Fragment>
        <Heading title={this.props.title} icon={this.props.icon} />
        {this.blockDescription && (
          <div className={`${this.props.baseClass}__details`}>
            <p
              className="description pad-bottom"
              dangerouslySetInnerHTML={{
                __html: this.blockDescription
              }}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}
