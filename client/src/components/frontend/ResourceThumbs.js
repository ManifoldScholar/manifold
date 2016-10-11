import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class ResourceThumbs extends Component {

  static propTypes = {
    projectId: PropTypes.string
  };

  constructor() {
    super();
  }

  getResourceType(type) {
    let formattedType = type.toLowerCase().charAt(0).toUpperCase() + type.slice(1);
    if (type.toLowerCase() === 'pdf') {
      formattedType = 'PDF';
    }

    return formattedType;
  }

  render() {
    const stubResources = [
      {
        id: 1,
        type: 'audio',
        title: 'Consectetur Ullamcorper'
      },
      {
        id: 2,
        type: 'video',
        image: '/static/placeholder/background-coniferous.jpg',
        title: 'Vestibulum id ligula porta felis euismod semper.'
      },
      {
        id: 3,
        type: 'pdf',
        title: 'Consectetur Amet Vestibulum Ultricies'
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
        title: 'Nullam quis risus eget urna mollis ornare'
      },
      {
        id: 7,
        type: 'presentation',
        title: 'Etiam Dolor Ipsum'
      },
      {
        id: 8,
        type: 'link',
        title: 'Lorem ipsum dolor sit, adipiscing elit.'
      },
      {
        id: 9,
        type: 'file',
        title: 'Venenatis Vehicula'
      },
      {
        id: 10,
        type: 'document',
        title: 'Dapibus Magna Elit Justo'
      },
      {
        id: 11,
        type: 'pdf',
        title: 'Vestibulum id ligula porta felis euismod semper.'
      },
      {
        id: 12,
        type: 'document',
        title: 'Dolor Sollicitudin Ultricies'
      },
      {
        id: 13,
        type: 'audio',
        title: 'Parturient Dolor Ultricies Adipiscing'
      }
    ];

    return (
      <nav className="resource-thumbnail-list">
        <ul>
          {stubResources.map((resource) => {
            const linkClass = classNames({
              'bg-image': resource.image
            });
            let linkStyle = {};
            if (resource.image) {
              linkStyle = {
                backgroundImage: `url('${resource.image}')`
              };
            }
            return (
              <li key={resource.id}>
                <Link
                  to={`/browse/project/${this.props.projectId}/resources/${resource.id}`}
                  className={linkClass} style={linkStyle}
                >
                  <figure className="resource-type">
                    <figcaption>
                      {this.getResourceType(resource.type)}
                    </figcaption>
                      <i className={`manicon manicon-resource-${resource.type}`}></i>
                  </figure>
                  <h4 className="resource-title">
                    {resource.title}
                  </h4>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
