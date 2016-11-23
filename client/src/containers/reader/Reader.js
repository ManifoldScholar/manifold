import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { HigherOrder, LoginOverlay, LoadingBar } from 'components/global';
import { Header, Footer, FooterMenu, Section } from 'components/reader';
import { commonActions } from 'actions/helpers';
import textsAPI from '../../api/texts';
import sectionsAPI from '../../api/sections';
import annotationsAPI from '../../api/annotations';
import { select } from '../../utils/entityUtils';
import values from 'lodash/values';
import {
  authActions,
  uiColorActions,
  uiVisibilityActions,
  uiTypographyActions,
  notificationActions,
  entityStoreActions
} from 'actions';

const { visibilityHide } = uiVisibilityActions;
const {
  selectFont,
  incrementFontSize,
  decrementFontSize,
  incrementMargins,
  decrementMargins
} = uiTypographyActions;
const { setColorScheme } = uiColorActions;
const { request, requests, flush } = entityStoreActions;


class ReaderContainer extends Component {

  static fetchData(getState, dispatch, location, params) {
    const promises = [];
    const textCall = textsAPI.show(params.textId);
    const { promise: one } = dispatch(request(textCall, requests.readerCurrentText));
    promises.push(one);
    if (params.sectionId) {
      const sectionCall = sectionsAPI.show(params.sectionId);
      const { promise: two } = dispatch(request(sectionCall,
        requests.readerCurrentSection));
      promises.push(two);

      const annotationsCall = annotationsAPI.forSection(params.sectionId);
      const { promise: three } = dispatch(request(annotationsCall,
        requests.sectionAnnotations));
      promises.push(three);
    }
    return Promise.all(promises);
  }

  static mapStateToProps(state) {
    const appearance = {
      typography: state.ui.typography,
      colors: state.ui.colors
    };
    return {
      annotations: select(requests.sectionAnnotations, state.entityStore),
      section: select(requests.readerCurrentSection, state.entityStore),
      text: select(requests.readerCurrentText, state.entityStore),
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

  componentWillReceiveProps(nextProps) {
    this.maybeRedirect(nextProps);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.readerCurrentSection));
    this.props.dispatch(flush(requests.readerCurrentText));
  }

  maybeRedirect(props) {
    if (props.text && !props.params.sectionId && __CLIENT__) {
      const startSectionId = props.text.attributes.startSectionId;
      if (startSectionId) {
        browserHistory.push(`/read/${props.text.id}/section/${startSectionId}`);
      } else {
        const firstSectionId = props.text.attributes.firstSectionId;
        browserHistory.push(`/read/${props.text.id}/section/${firstSectionId}`);
      }
    }
  }

  makeReaderActions = (dispatch) => {
    const b = bindActionCreators;
    return {
      selectFont: b((el) => selectFont(el), dispatch),
      incrementFontSize: b(incrementFontSize, dispatch),
      decrementFontSize: b(decrementFontSize, dispatch),
      incrementMargins: b(incrementMargins, dispatch),
      decrementMargins: b(decrementMargins, dispatch),
      setColorScheme: b((el) => setColorScheme(el), dispatch),
      createAnnotation: b(
        (sectionId, annotation) => {
          return request(
            annotationsAPI.create(sectionId, annotation),
            requests.createAnnotation
          );
        },
        dispatch
      )
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

    const section = this.props.children &&
      React.cloneElement(this.props.children, { ...this.props, ...this.readerActions });

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
            <Section.Pagination
              textId={this.props.text.id}
              sectionId={this.props.section.id}
              textSections={this.props.text.relationships.textSections}
            />
          </main>
          <Footer />
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
