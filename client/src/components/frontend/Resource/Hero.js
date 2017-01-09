import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { ResourceList } from 'components/frontend';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

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

    const tmp = `${attr.createdMonth}/1/${attr.createdYear}`;
    const uploadedDate = format(parse(tmp), 'MMMM, YYYY');

    return (
      <section className="resource-hero">
        <header>
          <h1 className="resource-title">
            {attr.title}
          </h1>
          <span className="resource-date">
            {`Uploaded ${uploadedDate}`}
          </span>
        </header>
        {this.getFigureByType(this.props.resource)}
      </section>
    );
  }
}
