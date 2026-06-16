import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Identity from "../parts/Identity";
import Utility from "global/components/utility";
import { withTranslation } from "react-i18next";

class ProjectContentBlockInListAvailable extends PureComponent {
  static displayName = "Project.Content.Block.InList.Available";

  static propTypes = {
    typeComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onClickAdd: PropTypes.func,
    disabled: PropTypes.bool,
    dragHandleRef: PropTypes.func,
    t: PropTypes.func
  };

  render() {
    const TypeComponent = this.props.typeComponent;

    return (
      <TypeComponent>
        {block => (
          <div
            ref={this.props.dragHandleRef}
            className="backend-content-block__inner"
          >
            <Identity icon={block.icon} title={block.title} />
            <button
              className="backend-content-block__button"
              aria-label={this.props.t("layout.add_block", {
                blockTitle: this.props.t(block.title)
              })}
              onClick={event => {
                if (!this.props.disabled) this.props.onClickAdd(event);
              }}
              aria-disabled={this.props.disabled || undefined}
            >
              <Utility.IconComposer
                icon="circlePlus32"
                size={32}
                className="backend-content-block__icon backend-content-block__icon--add"
              />
            </button>
          </div>
        )}
      </TypeComponent>
    );
  }
}

export default withTranslation()(ProjectContentBlockInListAvailable);
