import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Instructions from "../Instructions";

export default class FormHasManyHeader extends PureComponent {
  static displayName = "Form.HasMany.Header";

  static propTypes = {
    label: PropTypes.string.isRequired,
    labelHeader: PropTypes.bool,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  renderLabelHeader(label, instructions) {
    return (
      <React.Fragment>
        <header className="section-heading-secondary">
          <h3>{label}</h3>
        </header>
        <Instructions instructions={instructions} />
      </React.Fragment>
    );
  }

  renderHeader(label, instructions) {
    return (
      <React.Fragment>
        <h4 className="form-input-heading">{label}</h4>
        <Instructions instructions={instructions} />
      </React.Fragment>
    );
  }

  render() {
    const { label, instructions } = this.props;
    if (!label) return null;

    return this.props.labelHeader
      ? this.renderLabelHeader(label, instructions)
      : this.renderHeader(label, instructions);
  }
}
