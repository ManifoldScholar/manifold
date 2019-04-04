import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { featuresAPI, requests } from "api";
import { entityStoreActions } from "actions";
import connectAndFetch from "utils/connectAndFetch";
import entityUtils from "utils/entityUtils";
import EntitiesList, {
  Button,
  FeatureRow
} from "backend/components/list/EntitiesList";

const { select } = entityUtils;
const { request } = entityStoreActions;

class ContentFeaturesList extends PureComponent {
  static mapStateToProps = state => {
    return {
      features: select(requests.beFeatures, state.entityStore)
    };
  };

  static displayName = "Features.List";

  static propTypes = {
    features: PropTypes.array,
    dispatch: PropTypes.func
  };

  componentDidMount() {
    this.fetchFeatures();
  }

  fetchFeatures() {
    const call = featuresAPI.index();
    const featuresRequest = request(call, requests.beFeatures);
    this.props.dispatch(featuresRequest);
  }

  togglePublished = (event, feature) => {
    event.preventDefault();
    if (!feature) return null;

    const adjusted = Object.assign({}, feature);
    adjusted.attributes.live = !feature.attributes.live;

    const call = featuresAPI.update(feature.id, adjusted);
    const featureRequest = request(call, requests.beFeatureUpdate);
    this.props.dispatch(featureRequest);
  };

  render() {
    const { features } = this.props;
    if (!features) return null;
    return (
      <EntitiesList
        title="Manage Features"
        titleStyle="bar"
        entityComponent={FeatureRow}
        entityComponentProps={{
          onSwitchChange: this.togglePublished
        }}
        entities={features}
        buttons={[
          <Button
            path={lh.link("backendRecordsFeatureNew")}
            type="add"
            text="Create a new feature"
            authorizedFor="feature"
          />
        ]}
      />
    );
  }
}

export default connectAndFetch(ContentFeaturesList);
