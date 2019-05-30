import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Instructions from "../Instructions";

export default class FormHasManyHeader extends PureComponent {
  static displayName = "Form.HasMany.Header";

  static propTypes = {
    label: PropTypes.string.isRequired,
    labelTag: PropTypes.oneOf(["div", "h2", "h3", "h4"]),
    labelHeader: PropTypes.bool,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  static defaultProps = {
    labelTag: "div"
  };

  get labelTag() {
    return this.props.labelTag;
  }

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
    const Header = props => (
      <this.labelTag className="form-input-heading">
        {props.children}
      </this.labelTag>
    );

    return (
      <React.Fragment>
        <Header>{label}</Header>
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
