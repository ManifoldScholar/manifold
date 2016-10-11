import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import { ResourceListing } from 'components/frontend';

export default class ResourceThumbs extends Component {

  static propTypes = {
    projectId: PropTypes.string
  };

  constructor() {
    super();
  }

  render() {
    const stubResources = [
      {
        id: 1,
        type: 'audio',
        title: 'Consectetur Ullamcorper',
        tags: [
          'Japan'
        ]
      },
      {
        id: 2,
        type: 'video',
        image: '/static/placeholder/background-coniferous.jpg',
        title: 'Vestibulum id ligula porta felis euismod semper.',
        tags: [
          'Japan',
          'Photography',
          'Second Interview'
        ]
      },
      {
        id: 3,
        type: 'pdf',
        title: 'Consectetur Amet Vestibulum Ultricies',
        tags: [
          'Second Interview'
        ]
      },
      {
        id: 4,
        type: 'interactive',
        title: 'Ridiculus'
      },
      {
        id: 5,
        type: 'spreadsheet',
        title: 'Commodo Mattis Malesuada'
      },
      {
        id: 6,
        type: 'image',
        image: '/static/placeholder/background-waterfall.jpg',
        title: 'Nullam quis risus eget urna mollis ornare',
        tags: [
          'Japan',
          'Photography',
        ]
      },
      {
        id: 7,
        type: 'presentation',
        title: 'Etiam Dolor Ipsum',
        tags: [
          'Second Interview'
        ]
      },
      {
        id: 8,
        type: 'link',
        title: 'Lorem ipsum dolor sit, adipiscing elit.'
      },
      {
        id: 9,
        type: 'file',
        title: 'Venenatis Vehicula',
        tags: [
          'Photography',
          'Second Interview'
        ]
      },
      {
        id: 10,
        type: 'document',
        title: 'Dapibus Magna Elit Justo',
        tags: [
          'Japan',
          'Photography'
        ]
      },
      {
        id: 11,
        type: 'pdf',
        title: 'Vestibulum id ligula porta felis euismod semper.',
        tags: [
          'Second Interview'
        ]
      },
      {
        id: 12,
        type: 'document',
        title: 'Dolor Sollicitudin Ultricies'
      },
      {
        id: 13,
        type: 'audio',
        title: 'Parturient Dolor Ultricies Adipiscing',
        tags: [
          'Japan',
          'Second Interview'
        ]
      }
    ];

    return (
      <div>
        <nav className="resource-list">
          <div className="resource-count">
            <span>
              {stubResources.length.toLocaleString()}
            </span>
              {' Resources Shown'}
          </div>
          <ul>
            {stubResources.map((resource) => {
              return (
                <ResourceListing
                  resource={resource}
                  projectId={this.props.projectId}
                />
              );
            })}
          </ul>
        </nav>

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
      </div>
    );
  }
}
