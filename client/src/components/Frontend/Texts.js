import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router';

export default class extends Component {

  static propTypes = {
    texts: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <ul>
          {Object.values(this.props.texts).map((text) => {
            return (
              <li key={text.id} >
              <Link to={`/read/${text.id}`}>
              {(() => {
                if (text.attributes.coverUrl) {
                  return <img style={{width: 50}} src={text.attributes.coverUrl} />;
                }
                return <div />;
              })()}
              <div>
              {text.attributes.title}
              </div>
              </Link>
              </li>
            );
          }
          )}
        </ul>
      </div>
    );
  }
}

