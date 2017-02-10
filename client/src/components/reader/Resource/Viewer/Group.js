import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import Single from './Single';
import GroupThumbnail from './GroupThumbnail';
import { Resource } from 'components/frontend';

export default class ResourceViewerGroup extends PureComponent {

  static displayName = "ResourceViewer.Group";

  static propTypes = {
    items: PropTypes.array,
    setActiveAnnotation: PropTypes.func,
    activeAnnotation: PropTypes.string,
    location: PropTypes.number,
    height: PropTypes.number,
    singleHeight: PropTypes.number,
    fadeIn: PropTypes.bool,
    textId: PropTypes.string,
    sectionId: PropTypes.string
  };

  static defaultProps = {
    location: 0,
    fadeIn: true
  };

  constructor() {
    super();
    this.state = {
      visible: true,
      highlightedResourceId: null
    };

    this.handleFade = this.handleFade.bind(this);
    this.throttledFade = throttle(this.handleFade, 200).bind(this);
  }

  componentDidMount() {
    if (this.props.fadeIn) {
      this.handleFade(event);
      window.addEventListener('scroll', this.throttledFade);
    }
  }

  componentWillUnmount() {
    if (this.props.fadeIn) {
      window.removeEventListener('scroll', this.throttledFade);
    }
  }

  handleFade(event) {
    const rect = this.group.getBoundingClientRect();
    this.setState({
      visible: rect.top > 120 && (rect.top + rect.height / 2) < window.innerHeight
    });
  }

  getHighlightedItem() {
    if (!this.props.activeAnnotation) return this.props.items[0];
    // Set the highlighted item base on annotation ID
    const highlighted = this.props.items.filter((item) => {
      return this.props.activeAnnotation === item.annotationId;
    });

    return highlighted[0];
  }

  render() {
    const { textId, sectionId } = this.props;
    const highlightedItem = this.getHighlightedItem();
    const groupClass = classNames({
      'resource-preview-group': true,
      'transition-out': this.props.fadeIn && !this.state.visible,
      'transition-in': this.props.fadeIn && this.state.visible
    });

    const thumbnailsClass = classNames({
      'group-thumbnails': true,
      overflow: this.props.items.length > 8
    });

    return (

      <div className={groupClass}
        style={{
          top: this.props.location + 'px',
          height: this.props.height + 'px'
        }}
        ref={(r) => { this.group = r; }}
      >
        <div
          className="group-highlighted-resource-wrapper"
          style={{ height: this.props.singleHeight + 'px' }}
        >
          <ReactCSSTransitionGroup
            transitionName="highlight"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}
          >
            <Link
              to={`/read/${textId}/section/${sectionId}/resource/${highlightedItem.resource.id}`}
              className="group-highlighted-resource"
              title={highlightedItem.resource.id}
              key={highlightedItem.resource.id}
            >
              <Single
                resource={highlightedItem.resource}
                height={this.props.singleHeight}
                fadeIn={false}
              />
            </Link>
          </ReactCSSTransitionGroup>
        </div>

        <ul className={thumbnailsClass}>
          {this.props.items.map((item, index) => {

            return (
              <li key={index}>
                <Link
                  onMouseOver={() => { this.props.setActiveAnnotation(item.annotationId); }}
                  to={`/read/${textId}/section/${sectionId}/resource/${item.resource.id}`}
                  title={item.resource.id}
                >
                  <GroupThumbnail
                    resource={item.resource}
                    active={item.annotationId === this.props.activeAnnotation}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
