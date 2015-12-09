import React, { Component, PropTypes } from 'react';
import { ProjectCovers } from '../../components/frontend';
// import {Link} from 'react-router';

export default class extends Component {

  static propTypes = {
    texts: PropTypes.object
  };

  render() {
    return (
        <div>
          <ProjectCovers />
        </div>
    );
  }
}
