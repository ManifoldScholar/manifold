import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { featuresAPI, requests } from "api";
import connectAndFetch from "utils/connectAndFetch";
import entityUtils from "utils/entityUtils";
import { entityStoreActions, notificationActions } from "actions";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import FrontendLayout from "frontend/components/layout";
import withConfirmation from "hoc/withConfirmation";
import get from "lodash/get";
import IconComposer from "global/components/utility/IconComposer";
import SectionLabel from "global/components/form/SectionLabel";

import Authorize from "hoc/Authorize";

const { select } = entityUtils;
const { request, flush } = entityStoreActions;

class FeatureDetailContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      feature: select(requests.beFeature, state.entityStore),
      session: get(state.entityEditor.sessions, "backend-feature-update")
    };
  };

  static displayName = "Feature.Detail";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    confirm: PropTypes.func.isRequired,
    feature: PropTypes.object,
    route: PropTypes.object
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id !== "new") this.fetchFeature(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.id(this.props) !== this.id(prevProps)) {
      this.fetchFeature(this.props);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beFeature));
  }

  fetchFeature(props) {
    const id = this.id(props);
    if (!id) return;
    const call = featuresAPI.show(id);
    const featureRequest = request(call, requests.beFeature);
    props.dispatch(featureRequest);
  }

  redirectToFeatures() {
    const path = lh.link("backendRecordsFeatures");
    this.props.history.push(path);
  }

  handleSuccess = featureIgnored => {
    this.redirectToFeatures();
  };

  handleDestroy = () => {
    const { feature } = this.props;
    if (!feature) return;
    const heading = "Are you sure you want to delete this feature?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, () => this.doDestroy(feature));
  };

  doDestroy = feature => {
    const call = featuresAPI.destroy(feature.id);
    const options = { removes: feature };
    const featureRequest = request(call, requests.beFeatureDestroy, options);
    this.props.dispatch(featureRequest).promise.then(() => {
      this.notifyDestroy(feature);
      this.redirectToList();
    });
  };

  redirectToList() {
    const path = lh.link("backendRecordsFeatures");
    this.props.history.push(path);
  }

  notifyDestroy(feature) {
    const notification = {
      level: 0,
      id: `FEATURE_DESTROYED_${feature.id}`,
      heading: "The feature has been deleted.",
      body: `And we're sorry to see it go.`,
      expiration: 3000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  previewableFeature(props) {
    const { session } = props;
    if (!session) return null;
    const { source, dirty } = session;
    const previewAttributes = {
      ...source.attributes,
      ...dirty.attributes
    };
    const preview = { ...source, attributes: previewAttributes };
    return preview;
  }

  isNew(props) {
    return this.id(props) === "new";
  }

  id(props) {
    return props.match.params.id;
  }

  feature(props) {
    return props.feature;
  }

  newHeader() {
    return (
      <Navigation.DetailHeader
        type="feature"
        backUrl={lh.link("backendRecordsFeatures")}
        backLabel={"All Features"}
        title="New Feature"
        showUtility={false}
        note={
          "Complete the form below to make a new feature. Press save to continue."
        }
      />
    );
  }

  featureHeader(feature) {
    if (!feature) return null;
    return (
      <Navigation.DetailHeader
        type="feature"
        backUrl={lh.link("backendRecordsFeatures")}
        backLabel={"All Features"}
        title={
          feature.attributes.header ||
          `Untitled #${feature.attributes.position}`
        }
        utility={this.renderUtility()}
      />
    );
  }

  renderUtility() {
    return (
      <div className="utility-button-group utility-button-group--inline">
        <button onClick={this.handleDestroy} className="utility-button">
          <IconComposer
            icon="delete32"
            size={26}
            className="utility-button__icon utility-button__icon--notice"
          />
          <span className="utility-button__text">Delete</span>
        </button>
      </div>
    );
  }

  renderRoutes() {
    const { feature } = this.props;
    return childRoutes(this.props.route, {
      childProps: { feature, sessionName: "backend-feature-update" }
    });
  }

  render() {
    const feature = this.feature(this.props);
    const isNew = this.isNew(this.props);
    const authProps = isNew
      ? { entity: "feature", ability: "create" }
      : { entity: feature, ability: "update" };
    const previewFeature = this.previewableFeature(this.props);

    if (!authProps.entity) return null;

    return (
      <Authorize
        failureFatalError={{
          body: `You are not allowed to ${authProps.ability} features.`
        }}
        {...authProps}
      >
        <div>
          {isNew ? this.newHeader() : this.featureHeader(feature)}
          <Layout.BackendPanel>
            {feature || isNew ? (
              <section>
                {previewFeature ? (
                  <div className="form-secondary form-section form-section--primary">
                    <SectionLabel label="Feature Preview" />
                    <div className="form-input-group form-input-group--primary">
                      <div className="form-input wide">
                        <FrontendLayout.Splash
                          feature={previewFeature}
                          preview
                        />
                        <span className="instructions">
                          This is an approximate preview of your feature.
                          Foreground, background, and markdown will not be
                          displayed until the feature is saved.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
                {this.renderRoutes()}
              </section>
            ) : null}
          </Layout.BackendPanel>
        </div>
      </Authorize>
    );
  }
}

export default withConfirmation(connectAndFetch(FeatureDetailContainer));
