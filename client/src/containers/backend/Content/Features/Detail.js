import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { featuresAPI, requests } from "api";
import connectAndFetch from "utils/connectAndFetch";
import entityUtils from "utils/entityUtils";
import { entityStoreActions, notificationActions } from "actions";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { Dialog, Navigation } from "components/backend";
import { Layout } from "components/frontend";
import get from "lodash/get";

const { select } = entityUtils;
const { request, flush } = entityStoreActions;

class FeatureDetailContainer extends PureComponent {
  static displayName = "Content.Feature.Detail";

  static mapStateToProps = state => {
    return {
      feature: select(requests.beFeature, state.entityStore),
      session: get(state.entityEditor.sessions, "backend-feature-update")
    };
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    feature: PropTypes.object,
    route: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id !== "new") this.fetchFeature(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.id(this.props) !== this.id(nextProps)) {
      this.fetchFeature(nextProps);
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
    const path = lh.link("backendContentFeatures");
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
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.doDestroy(feature);
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
  };

  closeDialog = () => {
    this.setState({ confirmation: null });
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
    const path = lh.link("backendContentFeatures");
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
    const previewAttributes = Object.assign(
      {},
      source.attributes,
      dirty.attributes
    );
    const preview = Object.assign({}, source, {
      attributes: previewAttributes
    });
    return preview;
  }

  isNew(props) {
    return this.id(props) === "new";
  }

  id(props) {
    const id = props.match.params.id;
    return id;
  }

  feature(props) {
    return props.feature;
  }

  newHeader() {
    return (
      <Navigation.DetailHeader
        type="feature"
        breadcrumb={[
          { path: lh.link("backendContentFeatures"), label: "ALL FEATURES" }
        ]}
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
        breadcrumb={[
          { path: lh.link("backendContentFeatures"), label: "ALL FEATURES" }
        ]}
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
      <div>
        <button onClick={this.handleDestroy} className="button-bare-primary">
          Delete <i className="manicon manicon-trashcan" />
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
    const previewFeature = this.previewableFeature(this.props);
    return (
      <div>
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}
        {isNew ? this.newHeader() : this.featureHeader(feature)}
        <section className="backend-panel">
          <div className="container">
            {feature || isNew ? (
              <div className="panel">
                <section>
                  {previewFeature ? (
                    <div className="form-secondary">
                      <div className="form-input">
                        <label>Feature Preview</label>
                        <span className="instructions">
                          This is an approximate preview of your feature.
                          Foreground, background, and markdown will not be
                          displayed until the feature is saved.
                        </span>
                        <Layout.Splash feature={previewFeature} preview />
                      </div>
                    </div>
                  ) : null}
                  {this.renderRoutes()}
                </section>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(FeatureDetailContainer);
