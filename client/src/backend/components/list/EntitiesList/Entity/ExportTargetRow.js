import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityRow from "./Row";
import { withTranslation } from "react-i18next";

class ExportTargetRow extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    active: PropTypes.string.isRequired,
    t: PropTypes.func
  };

  render() {
    const { entity: exportTarget, active } = this.props;
    const { name, strategy } = exportTarget.attributes;
    const label = this.props.t(`settings.export_targets.${strategy}_tag`);

    return (
      <EntityRow
        onRowClick={lh.link("backendSettingsExportTargetEdit", exportTarget.id)}
        rowClickMode="block"
        title={name}
        label={label}
        active={active === exportTarget.id}
      />
    );
  }
}

export default withTranslation()(ExportTargetRow);
