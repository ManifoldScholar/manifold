import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityRow from "./Row";

export default class ExportTargetRow extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    active: PropTypes.string.isRequired
  };

  render() {
    const { entity: exportTarget, active } = this.props;
    const { name, strategy } = exportTarget.attributes;
    const label = strategy.replace("_", " ");

    return (
      <EntityRow
        onRowClick={lh.link("backendRecordsExportTargetEdit", exportTarget.id)}
        rowClickMode="block"
        title={name}
        label={label}
        active={active === exportTarget.id}
      />
    );
  }
}
