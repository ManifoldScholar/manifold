import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import EntityRow from "./Row";

export default class ProjectExportationRow extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  render() {
    const {
      entity: {
        attributes: { createdAt, exportedAt, currentState },
        relationships: {
          exportTarget: {
            attributes: { name: exportTargetName }
          }
        }
      }
    } = this.props;

    return (
      <EntityRow
        rowClickMode="block"
        title={<FormattedDate date={createdAt || exportedAt} format="PPpp" />}
        label={currentState}
        subtitle={exportTargetName}
      />
    );
  }
}
