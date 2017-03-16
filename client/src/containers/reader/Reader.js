import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { HigherOrder, LoginOverlay, LoadingBar } from 'components/global';
import { Header, Footer, FooterMenu, Section } from 'components/reader';
import { entityUtils } from 'utils';
import { commonActions } from 'actions/helpers';
import { resourcesAPI, textsAPI, sectionsAPI, annotationsAPI, requests } from 'api';
import values from 'lodash/values';
import uniq from 'lodash/uniq';
import difference from 'lodash/difference';

import {
  authActions,
  uiColorActions,
  uiVisibilityActions,
  uiTypographyActions,
  notificationActions,
  entityStoreActions
} from 'actions';

const { visibilityHide } = uiVisibilityActions;
const { select, grab, isEntityLoaded } = entityUtils;
const {
  selectFont,
  incrementFontSize,
  decrementFontSize,
  incrementMargins,
  decrementMargins
} = uiTypographyActions;
const { setColorScheme } = uiColorActions;
const { request, flush } = entityStoreActions;


class ReaderContainer extends Component {

  static fetchData(getState, dispatch, location, params) {
    const promises = [];
    const state = getState();
    const { sectionId, textId } = params;
    const sectionLoaded = sectionId ? isEntityLoaded('textSections', sectionId, state) : false;
    const textLoaded = textId ? isEntityLoaded('texts', textId, state) : false;

    if (textId && !textLoaded) {
      const textCall = textsAPI.show(params.textId);
      const { promise: one } = dispatch(request(textCall, requests.rText));
      promises.push(one);
    }

    if (sectionId && !sectionLoaded) {
      const sectionCall = sectionsAPI.show(params.sectionId);
      const { promise: two } = dispatch(request(sectionCall, requests.rSection));
      promises.push(two);
    }
    return Promise.all(promises);
  }

  static mapStateToProps(state, ownProps) {
    const appearance = {
      typography: state.ui.typography,
      colors: state.ui.colors
    };
    return {
      annotations: select(requests.rAnnotations, state.entityStore),
      section: grab("textSections", ownProps.params.sectionId, state.entityStore),
      text: grab("texts", ownProps.params.textId, state.entityStore),
      resources: select(requests.rResources, state.entityStore),
      authentication: state.authentication,
      visibility: state.ui.visibility,
      loading: state.ui.loading.active,
      notifications: state.notifications,
      renderDevTools: state.developer.renderDevTools,
      appearance
    };
  }

  static propTypes = {
    children: PropTypes.object,
    params: PropTypes.object,
    annotations: PropTypes.array,
    resources: PropTypes.array,
    location: PropTypes.object,
    text: PropTypes.object,
    section: PropTypes.object,
    visibility: PropTypes.object,
    appearance: PropTypes.object,
    authentication: PropTypes.object,
    dispatch: PropTypes.func,
    history: PropTypes.object,
    loading: PropTypes.bool,
    notifications: PropTypes.object
  };

  constructor() {
    super();
    this.counter = 0;
    this.maybeRedirect = this.maybeRedirect.bind(this);
  }

  componentWillMount() {
    this.maybeRedirect(this.props);
    this.readerActions = this.makeReaderActions(this.props.dispatch);
    this.commonActions = commonActions(this.props.dispatch);
  }

  componentDidMount() {
    if (this.props.params.sectionId) {
      this.fetchAnnotations(this.props);
      this.fetchResources(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    // Fetch resources and annotations on section change.
    if (nextProps.params.sectionId !== this.props.params.sectionId) {
      this.fetchAnnotations(nextProps);
      this.fetchResources(nextProps);
    }
    // Check if we need to fetch more resources when annotations change
    if (nextProps.annotations !== this.props.annotations) {
      if (this.hasMissingResources(nextProps.annotations, nextProps.resources)) {
        this.fetchResources(nextProps);
      }
    }
    this.maybeRedirect(nextProps);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.rSection));
    this.props.dispatch(flush(requests.rText));
  }

  fetchAnnotations(props) {
    const annotationsCall = annotationsAPI.forSection(props.params.sectionId);
    props.dispatch(request(annotationsCall, requests.rAnnotations));
  }

  fetchResources(props) {
    const resourcesCall = resourcesAPI.forSection(props.params.sectionId);
    props.dispatch(request(resourcesCall, requests.rResources));
  }

  maybeRedirect(props) {
    if (props.text && !props.params.sectionId && __CLIENT__) {
      const startTextSectionId = props.text.attributes.startTextSectionId;
      if (startTextSectionId) {
        browserHistory.push(`/read/${props.text.id}/section/${startTextSectionId}`);
      }
    }
  }


  hasMissingResources(annotations, resourcesIn) {
    if (!annotations) return;
    const resources = resourcesIn ? resourcesIn : [];
    const needed = uniq(annotations
      .map((a) => a.attributes.resourceId)
      .filter((id) => id !== null));
    const has = resources.map((r) => r.id);
    const diff = difference(needed, has);
    if (diff.length > 0) return true;
    return false;
  }

  makeReaderActions = (dispatch) => {
    const b = bindActionCreators;
    return {
      selectFont: b((el) => selectFont(el), dispatch),
      incrementFontSize: b(incrementFontSize, dispatch),
      decrementFontSize: b(decrementFontSize, dispatch),
      incrementMargins: b(incrementMargins, dispatch),
      decrementMargins: b(decrementMargins, dispatch),
      setColorScheme: b((el) => setColorScheme(el), dispatch)
    };
  };

  renderStyles = () => {
    return values(this.props.text.relationships.stylesheets).map((stylesheet, index) => {
      return (
        <style key={index}>
          {stylesheet.attributes.styles}
        </style>
      );
    });
  };

  render() {
    if (!this.props.text || !this.props.section) return null;

    const hideLoginOverlay = bindActionCreators(
      () => visibilityHide('loginOverlay'),
      this.props.dispatch
    );
    const { children, ...sectionProps } = this.props;
    const section = this.props.children &&
      React.cloneElement(this.props.children, { ...sectionProps, ...this.readerActions });

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
              visibility={this.props.visibility }
              appearance={this.props.appearance}
              notifications={this.props.notifications}
              commonActions={this.commonActions}
              {...this.readerActions}
            />
          </HigherOrder.ScrollAware>
          <main>
            {section}
            <Section.Label text={this.props.text} />
            <Section.NextSection
              sectionsMap={this.props.text.attributes.sectionsMap}
              textId={this.props.text.id}
              sectionId={this.props.section.id}
              typography={this.props.appearance.typography}
            />
            <Section.Pagination
              textId={this.props.text.id}
              sectionId={this.props.section.id}
              spine={this.props.text.attributes.spine}
            />
          </main>
          <Footer
            text={this.props.text}
          />
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

export default connect(
    ReaderContainer.mapStateToProps
)(ReaderContainer);
