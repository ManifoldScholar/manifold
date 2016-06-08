import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import config from '../../config';
import { browserHistory } from 'react-router';
import DocumentMeta from 'react-document-meta';
import { HigherOrder, LoginOverlay, LoadingBar } from '../../components/shared';
import { Header, Footer, Section } from '../../components/reader';
import { startLogout } from '../../actions/shared/authentication';
import { visibilityToggle, visibilityHide, visibilityShow, panelToggle, panelHide }
    from '../../actions/shared/ui/visibility';
import {
    selectFont,
    incrementFontSize,
    decrementFontSize,
    incrementMargins,
    decrementMargins
} from '../../actions/reader/ui/typography';
import {
    addNotification,
    removeNotification,
    removeAllNotifications
} from '../../actions/shared/notifications';
import { setColorScheme } from '../../actions/reader/ui/colors';
import { request, requests, flush } from '../../actions/shared/entityStore';
import textsAPI from '../../api/texts';
import sectionsAPI from '../../api/sections';
import { select } from '../../utils/entityUtils';
import values from 'lodash/values';

class ReaderContainer extends Component {

  static fetchData(getState, dispatch, location, params) {
    const promises = [];
    const textCall = textsAPI.show(params.textId);
    const { promise: one } = dispatch(request(textCall, requests.readerCurrentText));
    promises.push(one);
    if (params.sectionId) {
      const sectionCall = sectionsAPI.show(params.sectionId);
      const { promise: two } =
          dispatch(request(sectionCall, requests.readerCurrentSection));
      promises.push(one);
    }
    return Promise.all(promises);
  }

  static mapStateToProps(state) {
    const appearance = {
      typography: state.ui.typography,
      colors: state.ui.colors
    };
    return {
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
      const firstSectionId = props.text.attributes.firstSectionId;
      browserHistory.push(`/read/${props.text.id}/section/${firstSectionId}`);
    }
  }

  headerMethods = () => {
    const bac = bindActionCreators;
    return {
      visibilityToggle: bac((el) => visibilityToggle(el), this.props.dispatch),
      visibilityHide: bac((el) => visibilityHide(el), this.props.dispatch),
      visibilityShow: bac((el) => visibilityShow(el), this.props.dispatch),
      addNotification: bac((el) => addNotification(el), this.props.dispatch),
      removeNotification: bac((el) => removeNotification(el), this.props.dispatch),
      removeAllNotifications: bac(() => removeAllNotifications(), this.props.dispatch),
      panelToggle: bac((el) => panelToggle(el), this.props.dispatch),
      panelHide: bac((el) => panelHide(el), this.props.dispatch),
      selectFont: bac((el) => selectFont(el), this.props.dispatch),
      incrementFontSize: bac(incrementFontSize, this.props.dispatch),
      decrementFontSize: bac(decrementFontSize, this.props.dispatch),
      incrementMargins: bac(incrementMargins, this.props.dispatch),
      decrementMargins: bac(decrementMargins, this.props.dispatch),
      setColorScheme: bac((el) => setColorScheme(el), this.props.dispatch),
      startLogout: bac(startLogout, this.props.dispatch)
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
      React.cloneElement(this.props.children, { ...this.props });

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
              {...this.headerMethods()}
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
        </div>
      </HigherOrder.BodyClass>
    );
  }
}

export default connect(
    ReaderContainer.mapStateToProps
)(ReaderContainer);
