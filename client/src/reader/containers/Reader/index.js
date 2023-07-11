import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { bindActionCreators } from "redux";
import Overlay from "global/components/Overlay";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import TextMeta from "reader/components/TextMeta";
import Layout from "reader/components/layout";
import Toc from "reader/components/Toc";
import Footers from "global/components/Footers";
import Header from "reader/components/Header";
import ReaderFullNotes from "reader/containers/ReaderFullNotes";
import { select, grab, isEntityLoaded } from "utils/entityUtils";
import { commonActions } from "actions/helpers";
import { textsAPI, requests, meAPI } from "api";
import lh from "helpers/linkHandler";
import locationHelper from "helpers/location";
import { childRoutes } from "helpers/router";
import { Redirect } from "react-router-dom";
import { matchRoutes } from "react-router-config";
import {
  uiColorActions,
  uiTypographyActions,
  entityStoreActions
} from "actions";
import { setPersistentUI } from "actions/ui/persistentUi";
import { CSSTransition } from "react-transition-group";
import get from "lodash/get";
import ScrollAware from "hoc/ScrollAware";
import BodyClass from "hoc/BodyClass";
import Authorize from "hoc/Authorize";
import { ReaderContext } from "helpers/contexts";
import EventTracker, { EVENTS } from "global/components/EventTracker";

const {
  selectFont,
  incrementFontSize,
  decrementFontSize,
  incrementMargins,
  decrementMargins,
  resetTypography
} = uiTypographyActions;
const { setColorScheme } = uiColorActions;
const { request, flush } = entityStoreActions;

export class ReaderContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const promises = [];
    const state = getState();
    const { textId } = match.params;
    const textLoaded = textId ? isEntityLoaded("texts", textId, state) : false;
    if (textId && !textLoaded) {
      const textCall = textsAPI.show(textId);
      const { promise: one } = dispatch(request(textCall, requests.rText));
      promises.push(one);
    }
    return Promise.all(promises);
  };

  static mapStateToProps = (state, ownProps) => {
    const appearance = state.ui.persistent.reader;
    return {
      annotations: select(requests.rAnnotations, state.entityStore),
      section: grab(
        "textSections",
        ownProps.match.params.sectionId,
        state.entityStore
      ),
      text: grab("texts", ownProps.match.params.textId, state.entityStore),
      resources: select(requests.rSectionResources, state.entityStore),
      resourceCollections: select(
        requests.rSectionResourceCollections,
        state.entityStore
      ),
      authentication: state.authentication,
      visibility: state.ui.transitory.visibility,
      loading: state.ui.transitory.loading.active,
      notifications: state.notifications,
      renderDevTools: state.developer.renderDevTools,
      settings: select(requests.settings, state.entityStore),
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
    route: PropTypes.object.isRequired,
    hideTocDrawer: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      showMeta: false
    };
    this.readerActions = this.makeReaderActions(props.dispatch);
    this.commonActions = commonActions(props.dispatch);
  }

  componentDidMount() {
    this.setPersistentUI(this.props);
    this.maybeFetchReadingGroups();
  }

  componentDidUpdate(prevProps) {
    if (
      locationHelper.triggersScrollToTop(
        this.props.location,
        prevProps.location
      )
    ) {
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.rText));
    this.props.dispatch(flush(requests.rMyAnnotationsForText));
    this.props.dispatch(flush(requests.rMyFilteredAnnotationsForText));
  }

  maybeFetchReadingGroups() {
    const { authentication, settings, dispatch } = this.props;
    const { authenticated } = authentication;
    if (!authenticated) return;
    if (!settings) return;
    if (settings?.attributes?.general?.disableReadingGroups !== false) return;

    dispatch(request(meAPI.readingGroups(), requests.feMyReadingGroups));
  }

  get bodyClass() {
    let colorScheme = get(this.props, "appearance.colors.colorScheme");
    colorScheme = colorScheme ? `scheme-${colorScheme}` : "scheme-light";
    return `reader ${colorScheme}`;
  }

  get transitionProps() {
    return {
      classNames: "overlay-full",
      timeout: { enter: 200, exit: 200 }
    };
  }

  setPersistentUI = props => {
    const user = props.authentication.currentUser;
    if (!user) return null;
    this.readerActions.setPersistentUI(user.attributes.persistentUi.reader);
  };

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
      resetTypography: b(resetTypography, dispatch),
      setColorScheme: b(el => setColorScheme(el), dispatch),
      setPersistentUI: b(userUi => setPersistentUI(userUi), dispatch)
    };
  };

  hideTocDrawer = () => {
    this.commonActions.panelHide("tocDrawer");
  };

  toggleMeta = () => {
    this.setState({ showMeta: !this.state.showMeta });
  };

  maybeRenderOverlay(props) {
    if (this.state.showMeta) return this.renderTextMetaOverlay();
    if (props.location.hash === "#group-annotations")
      return this.renderNotesOverlay();
    return null;
  }

  renderTextMetaOverlay() {
    const text = this.props.text;
    return (
      <CSSTransition {...this.transitionProps}>
        <Overlay closeCallback={this.toggleMeta} appearance="overlay-full">
          <TextMeta
            title={text.attributes.titlePlaintext}
            subtitle={text.attributes.subtitle}
            meta={text.attributes.metadataFormatted}
          />
        </Overlay>
      </CSSTransition>
    );
  }

  renderNotesOverlay() {
    return (
      <Authorize kind="any">
        <CSSTransition {...this.transitionProps}>
          <ReaderFullNotes
            text={this.props.text}
            match={this.props.match}
            history={this.props.history}
            dispatch={this.props.dispatch}
            closeCallback={this.props.history.goBack}
          />
        </CSSTransition>
      </Authorize>
    );
  }

  renderRedirect(props) {
    const startTextSectionId = props.text.attributes.startTextSectionId;
    const path = lh.link(
      "readerSection",
      props.text.attributes.slug,
      startTextSectionId
    );
    return <Redirect to={path} />;
  }

  renderRoutes() {
    /* eslint-disable no-unused-vars */
    const { route, ...otherProps } = this.props;
    /* eslint-enable no-unused-vars */
    const childProps = { ...otherProps, ...this.readerActions };

    return childRoutes(this.props.route, { childProps, switch: false });
  }

  render() {
    if (!this.props.text) return null;
    if (this.shouldRedirect(this.props)) return this.renderRedirect(this.props);

    return (
      <BodyClass className={this.bodyClass}>
        <ReaderContext.Provider value={this.props.text}>
          <EventTracker
            event={EVENTS.VIEW_RESOURCE}
            resource={this.props.text}
          />
          <CheckFrontendMode
            debugLabel="ReaderWrapper"
            project={this.props.text.relationships.project}
          />
          <ScrollAware>
            {/* Header inside ScrollAware HOC */}
            <Header
              // Props required by body component
              text={this.props.text}
              section={this.props.section}
              authentication={this.props.authentication}
              visibility={this.props.visibility}
              location={this.props.location}
              appearance={this.props.appearance}
              notifications={this.props.notifications}
              commonActions={this.commonActions}
              history={this.props.history}
              match={this.props.match}
              {...this.readerActions}
            />
          </ScrollAware>
          <Toc
            text={this.props.text}
            section={this.props.section}
            tocDrawerVisible={this.props.visibility.uiPanels.tocDrawer}
            hideTocDrawer={this.hideTocDrawer}
            showMeta={this.toggleMeta}
          />
          <main
            id="skip-to-main"
            tabIndex={-1}
            className="main-content flex-viewport"
          >
            {this.maybeRenderOverlay(this.props)}
            {this.renderRoutes()}
          </main>
          <Footers.ReaderFooter text={this.props.text} />
          <Layout.PostFooter />
        </ReaderContext.Provider>
      </BodyClass>
    );
  }
}

export default connectAndFetch(ReaderContainer);
