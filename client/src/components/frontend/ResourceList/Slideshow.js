import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { ResourceList } from 'components/frontend';

export default class ResourceListSlideshow extends Component {

  static displayName = "ResourceList.Slideshow";

  static propTypes = {
    resources: PropTypes.array
  };

  constructor() {
    super();
    // Note that currentResource is matching to resource order
    // property, not order in array
    this.state = {
      currentResource: 0
    };

    this.handleSlidePrev = this.handleSlidePrev.bind(this);
    this.handleSlideNext = this.handleSlideNext.bind(this);
  }

  getFigureByType(resource) {
    let output = false;
    switch (resource.attributes.kind) {
      case 'image':
        output = (<ResourceList.Slide.SlideImage
          resource={resource}
        />);
        break;
      case 'video':
        output = (<ResourceList.Slide.SlideVideo
          resource={resource}
        />);
        break;
      default:
        output = (<ResourceList.Slide.Slide
          resource={resource}
        />);
    }

    return output;
  }

  handleSlidePrev() {
    if (this.state.currentResource > 0) {
      this.setState({
        currentResource: this.state.currentResource - 1
      });
    } else {
      this.setState({
        currentResource: this.props.resources.length - 1
      });
    }
  }

  handleSlideNext() {
    if (this.state.currentResource + 1 < this.props.resources.length) {
      this.setState({
        currentResource: this.state.currentResource + 1
      });
    } else {
      this.setState({
        currentResource: 0
      });
    }
  }

  render() {
    const resources = this.props.resources;
    const currentResource = resources[this.state.currentResource];
    return (
      <div className="resource-slideshow">
        {/*
          Note that .slide may be abstracted to a
          listed format to support multiple, sliding images
        */}
        <div className="slide">
          <div className="resource-slide-figure">
            <ReactCSSTransitionGroup
              transitionName="figure"
              transitionEnterTimeout={1}
              transitionLeaveTimeout={500}
            >
              <div key={currentResource.id}>
                {this.getFigureByType(currentResource)}
              </div>
            </ReactCSSTransitionGroup>
          </div>
          <div className="slide-footer">
            <ResourceList.Slide.Caption
              resource={currentResource}
            />
            <div className="slide-pagination">
              <span className="slide-ordinal">
                {this.state.currentResource + 1} {'/'} {resources.length}
              </span>
              <div>
                <button className="slide-previous" onClick={this.handleSlidePrev}>
                  <i className="manicon manicon-arrow-round-left"></i>
                  <span className="screen-reader-text">
                    {'Click to load previous slide'}
                  </span>
                </button>
                <button className="slide-next" onClick={this.handleSlideNext}>
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
