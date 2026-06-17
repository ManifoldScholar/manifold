import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Header from "./parts/Header";
import Block from "../Block";
import resolver from "../../helpers/resolver";
import { withTranslation } from "react-i18next";

class ProjectContentSectionsAvailable extends PureComponent {
  static displayName = "Project.Content.Sections.Available";

  static propTypes = {
    currentBlocks: PropTypes.array.isRequired,
    instanceId: PropTypes.symbol.isRequired,
    onClickAdd: PropTypes.func,
    headerId: PropTypes.string,
    instructionsId: PropTypes.string,
    t: PropTypes.func
  };

  static defaultProps = {
    currentBlocks: []
  };

  get types() {
    return Object.keys(resolver.blockComponentsByType());
  }

  render() {
    return (
      <div>
        <Header
          title={this.props.t("glossary.content_block_title_case_other")}
          subtitle={this.props.t("layout.blocks")}
          headerId={this.props.headerId}
          instructionsId={this.props.instructionsId}
        >
          {this.props.t("layout.customize_blocks_message")}
        </Header>
        <div className="block-grid full-width">
          {this.types.map((type, index) => (
            <Block
              key={type}
              currentBlocks={this.props.currentBlocks}
              context="available"
              type={type}
              index={index}
              instanceId={this.props.instanceId}
              onClickAdd={this.props.onClickAdd}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default withTranslation()(ProjectContentSectionsAvailable);
