import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { bindActionCreators } from "redux";
import { HigherOrder, Overlay } from "components/global";
import { Header, Footer, FooterMenu } from "components/reader";
import { Annotation } from "containers/reader";
import { select, grab, isEntityLoaded } from "utils/entityUtils";
import { commonActions } from "actions/helpers";
import { textsAPI, sectionsAPI, requests } from "api";
import values from "lodash/values";
import lh from "helpers/linkHandler";
import { renderRoutes } from "helpers/routing";
import { Redirect } from "react-router-dom";
import { matchRoutes } from "react-router-config";
import {
  uiColorActions,
  uiTypographyActions,
  entityStoreActions
} from "actions";

const {
  selectFont,
  incrementFontSize,
  decrementFontSize,
  incrementMargins,
  decrementMargins
} = uiTypographyActions;
const { setColorScheme } = uiColorActions;
const { request, flush } = entityStoreActions;

export class ReaderContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const promises = [];
    const state = getState();
    const { sectionId, textId } = match.params;
    const sectionLoaded = sectionId
      ? isEntityLoaded("textSections", sectionId, state)
      : false;
    const textLoaded = textId ? isEntityLoaded("texts", textId, state) : false;

    if (textId && !textLoaded) {
      const textCall = textsAPI.show(textId);
      const { promise: one } = dispatch(request(textCall, requests.rText));
      promises.push(one);
    }

    if (sectionId && !sectionLoaded) {
      const sectionCall = sectionsAPI.show(sectionId);
      const { promise: two } = dispatch(
        request(sectionCall, requests.rSection)
      );
      promises.push(two);
    }
    return Promise.all(promises);
  };

  static mapStateToProps = (state, ownProps) => {
    const appearance = {
      typography: state.ui.typography,
      colors: state.ui.colors
    };
    return {
      annotations: select(requests.rAnnotations, state.entityStore),
      section: grab(
        "textSections",
        ownProps.match.params.sectionId,
        state.entityStore
      ),
      text: grab("texts", ownProps.match.params.textId, state.entityStore),
      resources: select(requests.rSectionResources, state.entityStore),
      collections: select(requests.rSectionCollections, state.entityStore),
      authentication: state.authentication,
      visibility: state.ui.visibility,
      loading: state.ui.loading.active,
      notifications: state.notifications,
      renderDevTools: state.developer.renderDevTools,
      appearance
    };
  };

  static propTypes = {
    children: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,
    text: PropTypes.object,
    section: PropTypes.object,
    visibility: PropTypes.object,
    appearance: PropTypes.object,
    authentication: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object,
    loading: PropTypes.bool,
    notifications: PropTypes.object,
    route: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.counter = 0;
  }

  componentWillMount() {
    this.readerActions = this.makeReaderActions(this.props.dispatch);
    this.commonActions = commonActions(this.props.dispatch);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.rText));
  }

  shouldRedirect(props) {
    const matches = matchRoutes(
      props.route.routes,
      this.props.location.pathname
    );
    return matches.length === 0;
  }

  makeReaderActions = dispatch => {
    const b = bindActionCreators;
    return {
      selectFont: b(el => selectFont(el), dispatch),
      incrementFontSize: b(incrementFontSize, dispatch),
      decrementFontSize: b(decrementFontSize, dispatch),
      incrementMargins: b(incrementMargins, dispatch),
      decrementMargins: b(decrementMargins, dispatch),
      setColorScheme: b(el => setColorScheme(el), dispatch)
    };
  };

  maybeRenderOverlay() {
    if (this.props.location.hash === "#my-annotations")
      return this.renderMyAnnotations();
    return null;
  }

  renderRedirect(props) {
    const startTextSectionId = props.text.attributes.startTextSectionId;
    const path = lh.link("readerSection", props.text.id, startTextSectionId);
    return <Redirect to={path} />;
  }

  renderStyles = () => {
    return values(this.props.text.relationships.stylesheets).map(stylesheet => {
      return (
        <style
          key={stylesheet.id}
          dangerouslySetInnerHTML={{ __html: stylesheet.attributes.styles }}
        />
      );
    });
  };

  renderRoutes() {
    /* eslint-disable no-unused-vars */
    const { route, ...otherProps } = this.props;
    /* eslint-enable no-unused-vars */
    const injectProps = { ...otherProps, ...this.readerActions };
    const childRoutes = renderRoutes(this.props.route.routes, injectProps);
    return childRoutes;
  }

  renderMyAnnotations() {
    return (
      <Overlay
        closeCallback={this.props.history.goBack}
        title={"Your Highlights + Annotations"}
        contentWidth={850}
      >
        <Annotation.MineForText text={this.props.text} />
      </Overlay>
    );
  }

  render() {
    if (!this.props.text) return null;
    if (this.shouldRedirect(this.props)) return this.renderRedirect(this.props);
    if (!this.props.text) return null;

    return (
      <HigherOrder.BodyClass className="reader">
        <div>
          {this.renderStyles()}
          <HigherOrder.ScrollAware>
            {/* Header inside scroll-aware HOC */}
            <Header
              // Props required by body component
              text={this.props.text}
              section={this.props.section}
              authentication={this.props.authentication}
              visibility={this.props.visibility}
              appearance={this.props.appearance}
              notifications={this.props.notifications}
              commonActions={this.commonActions}
              {...this.readerActions}
            />
          </HigherOrder.ScrollAware>
          <main>
            {this.maybeRenderOverlay()}
            {this.renderRoutes()}
          </main>
          <Footer text={this.props.text} />
          <FooterMenu
            visibility={this.props.visibility}
            commonActions={this.commonActions}
            {...this.readerActions}
          />
        </div>
      </HigherOrder.BodyClass>
    );
  }
}

export default connectAndFetch(ReaderContainer);
