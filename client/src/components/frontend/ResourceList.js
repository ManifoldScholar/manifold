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
        id: Math.random() * 100,
        type: 'audio',
        title: 'Consectetur Ullamcorper',
        tags: [
          'Japan'
        ]
      },
      {
        id: Math.random() * 100,
        type: 'video',
        image: '/placeholder/background-coniferous.jpg',
        title: 'Vestibulum id ligula porta felis euismod semper.',
        tags: [
          'Japan',
          'Photography',
          'Second Interview'
        ]
      },
      {
        id: Math.random() * 100,
        type: 'pdf',
        title: 'Consectetur Amet Vestibulum Ultricies',
        tags: [
          'Second Interview'
        ]
      },
      {
        id: Math.random() * 100,
        type: 'interactive',
        title: 'Ridiculus'
      },
      {
        id: Math.random() * 100,
        type: 'spreadsheet',
        title: 'Commodo Mattis Malesuada'
      },
      {
        id: Math.random() * 100,
        type: 'image',
        image: '/placeholder/background-waterfall.jpg',
        title: 'Nullam quis risus eget urna mollis ornare',
        tags: [
          'Japan',
          'Photography',
        ]
      },
      {
        id: Math.random() * 100,
        type: 'presentation',
        title: 'Etiam Dolor Ipsum',
        tags: [
          'Second Interview'
        ]
      },
      {
        id: Math.random() * 100,
        type: 'link',
        title: 'Lorem ipsum dolor sit, adipiscing elit.'
      },
      {
        id: Math.random() * 100,
        type: 'file',
        title: 'Venenatis Vehicula',
        tags: [
          'Photography',
          'Second Interview'
        ]
      },
      {
        id: Math.random() * 100,
        type: 'document',
        title: 'Dapibus Magna Elit Justo',
        tags: [
          'Japan',
          'Photography'
        ]
      },
      {
        id: Math.random() * 100,
        type: 'pdf',
        title: 'Vestibulum id ligula porta felis euismod semper.',
        tags: [
          'Second Interview'
        ]
      },
      {
        id: Math.random() * 100,
        type: 'document',
        title: 'Dolor Sollicitudin Ultricies'
      },
      {
        id: Math.random() * 100,
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
