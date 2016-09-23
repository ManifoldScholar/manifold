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
        id: Math.random() * 100,
        type: 'audio',
        title: 'Consectetur Ullamcorper'
      },
      {
        id: Math.random() * 100,
        type: 'video',
        image: '/placeholder/background-coniferous.jpg',
        title: 'Vestibulum id ligula porta felis euismod semper.'
      },
      {
        id: Math.random() * 100,
        type: 'pdf',
        title: 'Consectetur Amet Vestibulum Ultricies'
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
        title: 'Nullam quis risus eget urna mollis ornare'
      },
      {
        id: Math.random() * 100,
        type: 'presentation',
        title: 'Etiam Dolor Ipsum'
      },
      {
        id: Math.random() * 100,
        type: 'link',
        title: 'Lorem ipsum dolor sit, adipiscing elit.'
      },
      {
        id: Math.random() * 100,
        type: 'file',
        title: 'Venenatis Vehicula'
      },
      {
        id: Math.random() * 100,
        type: 'document',
        title: 'Dapibus Magna Elit Justo'
      },
      {
        id: Math.random() * 100,
        type: 'pdf',
        title: 'Vestibulum id ligula porta felis euismod semper.'
      },
      {
        id: Math.random() * 100,
        type: 'document',
        title: 'Dolor Sollicitudin Ultricies'
      },
      {
        id: Math.random() * 100,
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
