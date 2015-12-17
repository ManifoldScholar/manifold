import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import { BodyClass, LoginOverlay } from '../../components/shared';
import { Header } from '../../components/reader';
import connectData from '../../decorators/connectData';
import { fetchOneText } from '../../actions/shared/collections';
import { select } from '../../utils/select';
import { visibilityToggle, visibilityHide, visibilityShow } from '../../actions/reader/ui/visibility';

function fetchData(getState, dispatch, location, params) {
  const promises = [];
  promises.push(fetchOneText(params.text_id)(dispatch, getState));
  return Promise.all(promises);
}

function mapStateToProps(state) {
  const textId = state.collections.results.fetchOneText.entities;
  const text = state.collections.entities.texts[textId];
  const {category, project, creators, contributors, textSections, tocSection} =
    select(text.relationships, state.collections.entities);
  return {
    text: text,
    category: category,
    project: project,
    creators: creators,
    contributors: contributors,
    textSections: textSections,
    tocSection: tocSection,
    authentication: state.authentication,
    visibility: state.ui.visibility
  };
}

@connectData(fetchData)
@connect(mapStateToProps)
class Reader extends Component {

  static propTypes = {
    children: PropTypes.object,
    params: PropTypes.object,
    text: PropTypes.object,
    visibility: PropTypes.object,
    authentication: PropTypes.object,
    dispatch: PropTypes.func
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.counter = 0;
  }

  componentWillMount = () => {
    if (!this.props.params.hasOwnProperty('section_id')) {
      this.transitionToFirstSection();
    }
  };

  transitionToFirstSection = () => {
    const firstSectionId = this.props.text.attributes.firstSectionId;
    this.props.history.push(`/read/${this.props.text.id}/section/${firstSectionId}`);
  };

  render() {
    const text = this.props.text
    return (
      <BodyClass className="reader">
        <div>
          <DocumentMeta {...config.app}/>
          <Header
              text={text}
              authenticated={this.props.authentication.authToken === null ? false : true}
              tocVisible={this.props.visibility.tocDrawer }
              toggleTocDrawer={bindActionCreators(() => visibilityToggle('tocDrawer'), this.props.dispatch)}
              hideTocDrawer={bindActionCreators(() => visibilityHide('tocDrawer'), this.props.dispatch)}
              showLoginOverlay={bindActionCreators(() => visibilityShow('loginOverlay'), this.props.dispatch)}
          />
          <LoginOverlay
              visible={this.props.visibility.loginOverlay}
              hideLoginOverlay={bindActionCreators(() => visibilityHide('loginOverlay'), this.props.dispatch)}
          />
          <main>
            {this.props.children}
          </main>
        </div>
      </BodyClass>
    );
  }
}

export default connect(
)(Reader);

