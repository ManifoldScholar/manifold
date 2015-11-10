import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import { BodyClass } from '../../components/shared';
import { Header } from '../../components/frontend';

class Frontend extends Component {

  static propTypes = {
    children: PropTypes.object,
    collection: PropTypes.array
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    return (
      <BodyClass className={'frontend'}>
        <div>
          <DocumentMeta {...config.app}/>
          <Header exampleCollection={this.props.collection} />
          <section className={'frontend-container'}>
            {this.props.children}
          </section>
        </div>
      </BodyClass>
    );
  }
}


function mapStateToProps(state) {
  return {
    collection: state.example.collection
  };
}
export default connect(
  mapStateToProps
)(Frontend);

