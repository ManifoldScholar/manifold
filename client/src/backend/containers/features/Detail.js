import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { featuresAPI, requests } from "api";
import connectAndFetch from "utils/connectAndFetch";
import entityUtils from "utils/entityUtils";
import { entityStoreActions, notificationActions } from "actions";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { Dialog, Navigation, Layout } from "components/backend";
import { Layout as FrontendLayout } from "components/frontend";
import { HigherOrder } from "containers/global";
import get from "lodash/get";

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
      <div>
        <button onClick={this.handleDestroy} className="button-bare-primary">
          <i className="manicon manicon-trashcan" aria-hidden="true" />
          Delete
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
      <HigherOrder.Authorize
        failureFatalError={{
          body: `You are not allowed to ${authProps.ability} features.`
        }}
        {...authProps}
      >
        <div>
          {this.state.confirmation ? (
            <Dialog.Confirm {...this.state.confirmation} />
          ) : null}
          {isNew ? this.newHeader() : this.featureHeader(feature)}
          <Layout.BackendPanel>
            {feature || isNew ? (
              <section>
                {previewFeature ? (
                  <div className="form-secondary form-section">
                    <header className="form-section-label">
                      <span>Feature Preview</span>
                    </header>
                    <div className="form-input-group">
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
      </HigherOrder.Authorize>
    );
  }
}

export default connectAndFetch(FeatureDetailContainer);
