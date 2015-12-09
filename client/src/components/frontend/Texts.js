import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router';

export default class extends Component {

  static propTypes = {
    texts: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    // const children = this.refs.texts.querySelectorAll('li');
    // const tallest = Array.from(children).reduce((memo, child) => {
    //   return child.offsetHeight > memo ? child.offsetHeight : memo
    // }, 0);
  }

  render() {
    return (
      <div>
        <ul ref="texts" className={'texts-list'}>
          {Object.values(this.props.texts).map((text) => {
            return (
              <li key={text.id} >
              <Link to={`/read/${text.id}`}>
              {(() => {
                if (text.attributes.coverUrl) {
                  return <img src={text.attributes.coverUrl} />;
                }
                return <div />;
              })()}
              <div className={'title'}>
              {text.attributes.title}
              </div>
              </Link>
              </li>
            );
          }
          )}
        </ul>
        <div className={'clear'} />
      </div>
    );
  }
}

