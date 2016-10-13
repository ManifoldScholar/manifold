import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class UtilityPagination extends Component {

  static displayName = "Utility.Pagination";

  static propTypes = {
  };

  constructor() {
    super();
  }

  render() {
    return (
      <nav className="list-pagination">
        <ul>
          <li className="pagination-previous">
            <Link to="#">
              <i className="manicon manicon-arrow-long-left"></i>
              Prev
            </Link>
          </li>
          <li>
            <Link to="#">1</Link>
          </li>
          <li className="active">
            <Link to="#">2</Link>
          </li>
          <li>
            <Link to="#">3</Link>
          </li>
          <li>
            <Link to="#">4</Link>
          </li>
          <li>
            <Link to="#">5</Link>
          </li>
          <li className="pagination-next">
            <Link to="#">
              Next
              <i className="manicon manicon-arrow-long-right"></i>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

}
