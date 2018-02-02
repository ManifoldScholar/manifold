import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { bindActionCreators } from "redux";
import { HigherOrder, Overlay } from "components/global";
import {
  Header,
  Footer,
  FooterMenu,
  Toc,
  Notes,
  TextMeta
} from "components/reader";
import { HigherOrder as HigherOrderContainer } from "containers/global";
import { ReaderNotes } from "containers/reader";
import { select, grab, isEntityLoaded } from "utils/entityUtils";
import { commonActions } from "actions/helpers";
import { textsAPI, sectionsAPI, requests } from "api";
import values from "lodash/values";
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
import { setPersistentUI } from "../../actions/ui/persistent_ui";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";

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
      collections: select(requests.rSectionCollections, state.entityStore),
      authentication: state.authentication,
      visibility: state.ui.transitory.visibility,
      loading: state.ui.transitory.loading.active,
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
    route: PropTypes.object.isRequired,
    hideTocDrawer: PropTypes.func
  };

  constructor() {
    super();
    this.counter = 0;
    this.state = {
      showMeta: false
    };
  }

  componentWillMount() {
    this.readerActions = this.makeReaderActions(this.props.dispatch);
    this.commonActions = commonActions(this.props.dispatch);
  }

  componentDidMount() {
    this.setPersistentUI(this.props);
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
      setColorScheme: b(el => setColorScheme(el), dispatch),
      setPersistentUI: b(userUi => setPersistentUI(userUi), dispatch)
    };
  };

  hideTocDrawer = () => {
    this.commonActions.visibilityHide("tocDrawer");
  };

  toggleMeta = () => {
    this.setState({ showMeta: !this.state.showMeta });
  };

  maybeRenderOverlay(props) {
    if (this.state.showMeta) return this.renderTextMetaOverlay();
    if (props.location.hash === "#my-annotations")
      return this.renderNotesOverlay();
    return null;
  }

  renderTextMetaOverlay() {
    const text = this.props.text;
    return (
      <Overlay closeCallback={this.toggleMeta} appearance="overlay-full">
        <TextMeta
          title={text.attributes.title}
          subtitle={text.attributes.subtitle}
          meta={text.attributes.metadataFormatted}
        />
      </Overlay>
    );
  }

  renderNotesOverlay() {
    return (
      <HigherOrderContainer.RequireKind requiredKind="any">
        <Overlay
          closeCallback={this.props.history.goBack}
          title={"Your Notes"}
          icon={"notepad"}
          contentWidth={850}
        >
          <ReaderNotes>
            <Notes.DetailedList />
          </ReaderNotes>
        </Overlay>
      </HigherOrderContainer.RequireKind>
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
    const childProps = { ...otherProps, ...this.readerActions };
    return childRoutes(this.props.route, { childProps, switch: false });
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
              history={this.props.history}
              match={this.props.match}
              {...this.readerActions}
            />
          </HigherOrder.ScrollAware>
          <Toc
            text={this.props.text}
            section={this.props.section}
            tocDrawerVisible={this.props.visibility.tocDrawer}
            hideTocDrawer={this.hideTocDrawer}
            showMeta={this.toggleMeta}
          />
          <main>
            <ReactCSSTransitionGroup
              transitionName="overlay-full"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={200}
            >
              {this.maybeRenderOverlay(this.props)}
            </ReactCSSTransitionGroup>
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
