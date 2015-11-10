import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Texts } from '../../components/frontend';
import { fetchTexts } from '../../actions/shared/collections';

class Home extends Component {

  static propTypes = {
    children: PropTypes.object,
    texts: PropTypes.object,
    actions: React.PropTypes.shape({
      fetchTexts: React.PropTypes.func.isRequired
    })
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static fetchData(getState, dispatch) {
    // If we had to load from mutiple endpoints, we'd want to
    // return Promise.all([an array of promises]), but instead
    // we can return one promise.
    return dispatch(fetchTexts());
  }

  render() {
    return (
       <Texts texts={this.props.texts} />
    );
  }
}

function mapStateToProps(state) {
  return {
    texts: state.collections.entities.texts
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({fetchTexts}, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

