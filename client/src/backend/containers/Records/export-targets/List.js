import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { exportTargetsAPI, requests } from "api";
import get from "lodash/get";
import EntitiesList, {
  ExportTargetRow
} from "backend/components/list/EntitiesList";

const { request } = entityStoreActions;

export class ExportTargetsContainerImplementation extends PureComponent {
  static mapStateToProps = state => {
    return {
      exportTargets: select(requests.beExportTargets, state.entityStore),
      exportTargetMeta: meta(requests.beExportTargets, state.entityStore)
    };
  };

  static displayName = "ExportTargets.List";

  static propTypes = {
    // export target information is required to render the component,
    // but can be null until the async network request is fulfilled
    /* eslint-disable react/require-default-props */
    exportTargets: PropTypes.array,
    exportTargetsMeta: PropTypes.object,
    /* eslint-enable react/require-default-props */
    match: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.fetchExportTargets();
  }

  componentDidUpdate(prevProps) {
    if (this.exportTargetWasModified(prevProps))
      return this.fetchExportTargets();
  }

  fetchExportTargets = () => {
    const action = request(exportTargetsAPI.index(), requests.beExportTargets);
    this.props.dispatch(action);
  };

  exportTargetWasModified(prevProps) {
    const currentModified = get(this.props, "exportTargets.modified");
    const previousModified = get(prevProps, "exportTargetsMeta.modified");
    if (!currentModified) return false;
    return !(currentModified && previousModified);
  }

  render() {
    const { exportTargets, match } = this.props;
    if (!exportTargets) return null;
    const active = match.params.id || "";

    return (
      <>
        <EntitiesList
          entityComponent={ExportTargetRow}
          entityComponentProps={{ active }}
          title="Manage Export Targets"
          titleStyle="bar"
          entities={exportTargets}
          unit={{
            singular: "export target",
            plural: "export targets"
          }}
        />
      </>
    );
  }
}

export default connect(ExportTargetsContainerImplementation.mapStateToProps)(
  ExportTargetsContainerImplementation
);
