import React, { Component, PropTypes } from 'react';
// import {Link} from 'react-router';

export default class extends Component {

  static propTypes = {
    texts: PropTypes.object
  };

  render() {
    return (
        <nav className="grid-project-covers">
          <ul>
            <li>
              <a href="#">
                <img src="/placeholder/browse-pCover-blanchot01.jpg" alt="Click to view project with title"/>
              </a>
            </li>
            <li>
              <a href="#">
                <img src="/placeholder/browse-pCover-grusin01.jpg" alt="Click to view project with title"/>
              </a>
            </li>
            <li>
              <a href="#">
                <img src="/placeholder/browse-pCover-nornes01.jpg" alt="Click to view project with title"/>
              </a>
            </li>
            <li>
              <a href="#">
                <img src="/placeholder/browse-pCover-bogost01.jpg" alt="Click to view project with title"/>
              </a>
            </li>
            <li>
              <a href="#">
                <img src="/placeholder/browse-pCover-maoilearca01.jpg" alt="Click to view project with title"/>
              </a>
            </li>
            <li>
              <a href="#">
                <img src="/placeholder/browse-pCover-parikka01.jpg" alt="Click to view project with title"/>
              </a>
            </li>
          </ul>
        </nav>
    );
  }
}
