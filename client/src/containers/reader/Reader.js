import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import { BodyClass } from '../../components/shared';
import connectData from '../../decorators/connectData';
import { fetchOneText } from '../../actions/shared/collections';
import {Link} from 'react-router';


function fetchData(getState, dispatch, location, params) {
  const promises = [];
  if (!getState().collections.results.fetchOneText.receivedAt) {
    promises.push(fetchOneText(params.text_id)(dispatch, getState));
  }
  return Promise.all(promises);
}

function mapStateToProps(state) {
  return {
    fetchOneText: state.collections.results.fetchOneText.entities,
    texts: state.collections.entities.texts,
    makers: state.collections.entities.makers
  };
}

@connectData(fetchData)
@connect(mapStateToProps)

class Reader extends Component {

  static propTypes = {
    children: PropTypes.object,
    texts: PropTypes.object,
    fetchOneText: PropTypes.string
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

  visitNode = (node) => {
    const text = this.getText();
    this.counter = this.counter + 1;
    let children = null;
    if (node.children && node.children.length > 0) {
      children = (
        <ul>
          {node.children.map(this.visitNode)}
        </ul>
      );
    }

    return (
      <li key={this.counter}>
        <Link to={`/read/${text.id}/section/${node.id}#${node.anchor}`}>
          {node.label}
        </Link>
        {children}
      </li>

    );
  };

  render() {
    const text = this.getText();
    return (
      <BodyClass className="reader">
        <div>
          <div style={{width: '25%',
          float: 'left',
          borderRight: '1px solid black',
          padding: '20px'}}>
            <DocumentMeta {...config.app}/>
            <ul>
              {text.attributes.toc.map(this.visitNode)}
            </ul>
          </div>
          <div style={{width: '70%',
            float: 'left',
            borderRight: '1px solid black'
            }}>
            {this.props.children}
          </div>
        </div>
      </BodyClass>
    );
  }
}

export default connect(
)(Reader);

