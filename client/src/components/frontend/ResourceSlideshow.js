import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ResourceSlideshow extends Component {
  static defaultProps = {
    resources: [
      {
        title: 'Nulla vitae elit libero',
        type: 'image',
        image: '/placeholder/portrait-unsplash01.jpg',
        description:
          'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. ' +
          'Donec id elit non mi porta gravida at eget metus. Morbi leo risus, ' +
          'porta ac consectetur ac, vestibulum at eros. Maecenas sed diam eget ' +
          'risus varius blandit sit amet non magna. Integer posuere erat a ante ' +
          'venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna ' +
          'mollis ornare vel eu leo. Praesent commodo cursus magna, ' +
          'vel scelerisque nisl consectetur et.',
        link: '/placeholder/portrait-unsplash01.jpg'
      },
      {
        title: 'Euismod Venenatis Sollicitudin',
        type: 'pdf',
        description:
          'Maecenas sed diam eget risus varius blandit sit amet non magna. ' +
          'Cras mattis consectetur purus sit amet fermentum. Donec id elit non' +
          ' mi porta gravida at eget metus. Curabitur blandit tempus porttitor.',
        link: '#'
      },
      {
        title: 'Cras justo odio, dapibus ac facilisis',
        type: 'image',
        image: '/placeholder/portrait-ndt01.jpg',
        description:
          'Maecenas sed diam eget risus varius blandit sit amet non magna. ' +
          'Cras mattis consectetur purus sit amet fermentum. Donec id elit non' +
          ' mi porta gravida at eget metus. Curabitur blandit tempus porttitor.',
        link: '/placeholder/portrait-ndt01.jpg'
      },
      {
        title: 'Cras justo odio, dapibus ac facilisis',
        type: 'video',
        video: 'https://vimeo.com/89700651',
        description:
          'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. ' +
          'Donec id elit non mi porta gravida at eget metus. Morbi leo risus, ' +
          'porta ac consectetur ac, vestibulum at eros. Maecenas sed diam eget ' +
          'risus varius blandit sit amet non magna. Integer posuere erat a ante ' +
          'venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna ' +
          'mollis ornare vel eu leo. Praesent commodo cursus magna, ' +
          'vel scelerisque nisl consectetur et.',
        link: 'https://vimeo.com/89700651'
      },
      {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        type: 'file',
        image: '/placeholder/background-coniferous.jpg',
        description:
          'Maecenas sed diam eget risus varius blandit sit amet non magna. ' +
          'Cras mattis consectetur purus sit amet fermentum. Donec id elit non' +
          ' mi porta gravida at eget metus. Curabitur blandit tempus porttitor.',
        link: '#'
      }
    ]
  };

  static propTypes = {
    resources: PropTypes.array
  };

  render() {
    return (
      <div className="resource-slideshow">
        {/*
          Note that .slide may be abstracted to a
          listed format to support multiple, sliding images
        */}
        <div className="slide">
          <figure style={ { backgroundImage: 'url(/placeholder/portrait-unsplash01.jpg)' } }>
          </figure>
          <div className="slide-caption">
            <div className="resource-info">
              <header>
                <h2 className="resource-title">
                  Title of the resource
                </h2>
              </header>
              <div className="resource-description">
                <p>
                  {
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. ' +
                    'Donec id elit non mi porta gravida at eget metus. Morbi leo risus, ' +
                    'porta ac consectetur ac, vestibulum at eros. Maecenas sed diam eget ' +
                    'risus varius blandit sit amet non magna. Integer posuere erat a ante ' +
                    'venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna ' +
                    'mollis ornare vel eu leo. Praesent commodo cursus magna, ' +
                    'vel scelerisque nisl consectetur et.'
                  }
                </p>
              </div>
              <div className="resource-utility">
                <div className="bg-neutral90">
                  <button className="more-link">
                    {'Read More'}
                  </button>
                  <Link to="#" className="download-link">
                    {'Download'} <i className="manicon manicon-arrow-down"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="slide-pagination">
              <span className="slide-ordinal">
                {'178 / 185'}
              </span>
              <div>
                <button className="slide-previous">
                  <i className="manicon manicon-arrow-round-left"></i>
                  <span className="screen-reader-text">
                    {'Click to load previous slide'}
                  </span>
                </button>
                <button className="slide-next">
                  <i className="manicon manicon-arrow-round-right"></i>
                  <span className="screen-reader-text"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
