import React, { Component, PropTypes } from 'react';
import { ExampleCollection } from '../../components/shared';
import * as exampleActionCreators from '../../actions/shared/example';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ExampleContainer extends Component {

  static propTypes = {
    collection: PropTypes.array,
    dispatch: PropTypes.func
  };

  static defaultProps = {
    collection: []
  };

  constructor() {
    super();
    this.state = { collection: [] };
  }

  push() {
    const collection = this.state.collection.slice(0);
    collection.push(Math.random());
    this.setState(() => {
      return {collection: collection};
    });
  }

  pop() {
    const collection = this.state.collection.slice(0);
    collection.pop();
    this.setState(() => {
      return {collection: collection};
    });
  }

  render() {
    const { dispatch } = this.props;
    const boundActionCreators = bindActionCreators(exampleActionCreators, dispatch);

    const pushExampleCollection = () => {
      boundActionCreators.pushExampleCollection(Math.random(2));
    };

    return (
      <div>
        <button onClick={() => {this.push();}}>State Push</button>
        <button onClick={() => {this.pop();}}>State Pop</button>
        <ExampleCollection collection={this.state.collection} {...boundActionCreators} />

        <button onClick={pushExampleCollection}>Store Push</button>
        <button onClick={boundActionCreators.popExampleCollection}>Store Pop</button>
        <ExampleCollection collection={this.props.collection} {...boundActionCreators} />
      </div>
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
)(ExampleContainer);


