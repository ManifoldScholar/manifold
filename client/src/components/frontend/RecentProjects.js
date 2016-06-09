import React, { Component, PropTypes } from 'react';
import { ProjectCovers } from './';
// import {Link} from 'react-router';

export default class RecentProjects extends Component {

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
