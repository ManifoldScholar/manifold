import React, { PureComponent, PropTypes } from 'react';
import throttle from 'lodash/throttle';
import { Link } from 'react-router';
import classNames from 'classnames';
import Single from './Single';
import GroupThumbnail from './GroupThumbnail';
import { Resource } from 'components/frontend';

export default class ResourceViewerSingle extends PureComponent {

  static displayName = "ResourceViewer.Single";

  static propTypes = {
    items: PropTypes.array,
    location: PropTypes.number,
    height: PropTypes.number,
    singleHeight: PropTypes.number,
    highlightResourceId: PropTypes.string,
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
      visible: true
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
    const highlighted = this.props.items.filter((item) => {
      return this.props.highlightResourceId === item.resource.id;
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
        <Link
          to={`/read/${textId}/section/${sectionId}/resource/${highlightedItem.resource.id}`}
          className="group-highlighted-resource"
          title={highlightedItem.resource.id}
        >
          <Single
            resource={highlightedItem.resource}
            height={this.props.singleHeight}
            fadeIn={false}
          />
        </Link>

        <ul className={thumbnailsClass}>
          {this.props.items.map((item, index) => {

            return (
              <li key={index}>
                <Link
                  to={`/read/${textId}/section/${sectionId}/resource/${item.resource.id}`}
                  title={item.resource.id}
                >
                  <GroupThumbnail
                    resource={item.resource}
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
