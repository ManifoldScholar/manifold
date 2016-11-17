import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { ResourceList } from 'components/frontend';

export default class ResourceHero extends Component {

  static displayName = "Resource.Hero";

  static propTypes = {
    resource: PropTypes.object
  };

  constructor() {
    super();
    this.getFigureByType = this.getFigureByType.bind(this);
  }

  getFigureByType(resource) {
    let output = null;
    switch (resource.attributes.kind) {
      case 'image':
        output = (
          <div className="resource-slide-figure">
            <ResourceList.Slide.SlideImage
              resource={resource}
            />
          </div>
        );
        break;
      case 'video':
        output = (
          <div className="resource-slide-figure">
            <ResourceList.Slide.SlideVideo
              resource={resource}
            />
          </div>
        );
        break;
      default:
    }

    return output;
  }

  render() {
    const attr = this.props.resource.attributes;

    return (
      <section className="resource-hero">
        <header>
          <h1 className="resource-title">
            {attr.title}
          </h1>
          <span className="resource-date">
            {
              `Uploaded
              ${moment().month(attr.createdMonth - 1).format("MMMM")},
              ${attr.createdYear}`
            }
          </span>
        </header>
        {this.getFigureByType(this.props.resource)}
      </section>
    );
  }
}
