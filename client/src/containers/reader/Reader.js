import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import { BodyClass } from '../../components/shared';
import { Header } from '../../components/reader';
import connectData from '../../decorators/connectData';
import { fetchOneText } from '../../actions/shared/collections';
import { visibilityToggle, visibilityHide } from '../../actions/reader/ui/visibility';


function fetchData(getState, dispatch, location, params) {
  const promises = [];
  promises.push(fetchOneText(params.text_id)(dispatch, getState));
  return Promise.all(promises);
}

function mapStateToProps(state) {
  return {
    fetchOneText: state.collections.results.fetchOneText.entities,
    texts: state.collections.entities.texts,
    makers: state.collections.entities.makers,
    visibility: state.ui.visibility
  };
}

@connectData(fetchData)
@connect(mapStateToProps)

class Reader extends Component {

  static propTypes = {
    children: PropTypes.object,
    texts: PropTypes.object,
    fetchOneText: PropTypes.string,
    visibility: PropTypes.object,
    dispatch: PropTypes.func
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.counter = 0;
  }

  getText = () => {
    return this.props.texts[this.props.fetchOneText];
  };

  render() {
    const text = this.getText();
    return (
      <BodyClass className="reader">
        <div>
          <DocumentMeta {...config.app}/>
          <Header
              text={text}
              tocVisible={this.props.visibility.tocDrawer }
              toggleTocDrawer={bindActionCreators(() => visibilityToggle('tocDrawer'), this.props.dispatch)}
              hideTocDrawer={bindActionCreators(() => visibilityHide('tocDrawer'), this.props.dispatch)}
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

