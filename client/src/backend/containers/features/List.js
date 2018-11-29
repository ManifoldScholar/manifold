import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import List from "backend/components/list";
import Layout from "backend/components/layout";
import Feature from "backend/components/feature";
import { featuresAPI, requests } from "api";
import { entityStoreActions } from "actions";
import connectAndFetch from "utils/connectAndFetch";
import entityUtils from "utils/entityUtils";

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

  // updateFeaturePosition(feature, newPos) {
  //   const changes = {
  //     attributes: { position: newPos }
  //   };
  //   const call = featuresAPI.update(feature.id, changes);
  //   const featureRequest = request(call, requests.beFeatureUpdate);
  //   this.props.dispatch(featureRequest).promise.then(() => {
  //     this.fetchFeatures();
  //   });
  // }

  render() {
    const { features } = this.props;
    return (
      <div>
        <Layout.ViewHeader>Manage Features</Layout.ViewHeader>
        <Layout.BackendPanel>
          {features ? (
            <List.Searchable
              newButton={{
                path: lh.link("backendRecordsFeatureNew"),
                text: "Create a new feature",
                authorizedFor: "feature"
              }}
              entities={features}
              entityComponent={Feature.ListItem}
              singularUnit="feature"
              pluralUnit="features"
            />
          ) : null}
        </Layout.BackendPanel>
      </div>
    );
  }
}

export default connectAndFetch(ContentFeaturesList);