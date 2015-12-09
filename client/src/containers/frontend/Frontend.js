import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import { BodyClass } from '../../components/shared';
import { Header, Footer } from '../../components/frontend';

class Frontend extends Component {

  static propTypes = {
    children: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    return (
      <BodyClass className={'browse'}>
        <div>
          <DocumentMeta {...config.app}/>
          <Header />
          <span className={'manicon manicon-check'}></span>
          <span className={'manicon manicon-magnify'}></span>
          <span className={'manicon manicon-new-round'}></span>
          <span className={'manicon manicon-person'}></span>
          <span className={'manicon manicon-plus'}></span>
          <main>
            {this.props.children}
          </main>
          <Footer />
        </div>
      </BodyClass>
    );
  }
}

export default connect(
  // mapStateToProps
)(Frontend);

