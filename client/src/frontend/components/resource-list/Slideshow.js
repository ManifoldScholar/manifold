import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import Swipeable from "react-swipeable";
import includes from "lodash/includes";
import ResourceList from "frontend/components/resource-list";
import { collectionsAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default class ResourceListSlideshow extends PureComponent {
  static displayName = "ResourceList.Slideshow";

  static propTypes = {
    collectionResources: PropTypes.array,
    pagination: PropTypes.object,
    dispatch: PropTypes.func,
    collection: PropTypes.object.isRequired,
    hideDetailUrl: PropTypes.bool,
    hideDownload: PropTypes.bool,
    slideOptions: PropTypes.object
  };

  static defaultProps = {
    slideOptions: {},
    hideDetailUrl: false,
    hideDownload: false
  };

  constructor(props) {
    super();

    // Using resource order in array now that array is
    // ordered by collection_resource position
    this.state = {
      position: 1,
      loadedPages: [1],
      map: {},
      totalCount: 0,
      slideDirection: "left"
    };
    this.state.map = this.buildNewMap(
      props.collectionResources,
      props.pagination
    );
    this.state.totalCount = props.pagination.totalCount || 0;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextState = {};
    if (nextProps.pagination.totalCount > 0) {
      nextState.totalCount = nextProps.pagination.totalCount;
    }

    const loadedPages = prevState.loadedPages.slice(0);
    const page = nextProps.pagination.currentPage;
    if (!includes(loadedPages, page)) {
      loadedPages.push(page);
      nextState.loadedPages = loadedPages;
    }

    return nextState === {} ? null : nextState;
  }

  componentDidMount() {
    document.addEventListener("keyup", this.bindKeyboard, false);
  }

  componentDidUpdate(prevProps) {
    if (this.props.collectionResources !== prevProps.collectionResources) {
      this.updateMap(this.props.collectionResources, this.props.pagination);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.bindKeyboard, false);
  }

  getFigureByType(resource) {
    let Slide = ResourceList.Slide.Slide;
    if (resource.attributes.kind === "image")
      Slide = ResourceList.Slide.SlideImage;
    if (resource.attributes.kind === "video")
      Slide = ResourceList.Slide.SlideVideo;
    if (resource.attributes.kind === "interactive")
      Slide = ResourceList.Slide.SlideInteractive;
    if (resource.attributes.kind === "audio")
      Slide = ResourceList.Slide.SlideAudio;
    return <Slide resource={resource} {...this.props.slideOptions} />;
  }

  bindKeyboard = event => {
    if (event.keyCode === 39) {
      this.handleSlideNext();
    } else if (event.keyCode === 37) {
      this.handleSlidePrev();
    }
  };

  handleUnloadedSlide = position => {
    const page = this.positionToPage(position, this.props.pagination.perPage);
    if (!this.isPageLoaded(page)) {
      const fetch = collectionsAPI.collectionResources(
        this.props.collection.id,
        {},
        { number: page, size: this.props.pagination.perPage }
      );
      this.props.dispatch(request(fetch, requests.feSlideshow));
    }
  };

  handleSlidePrev = () => {
    if (this.state.slideDirection !== "right") {
      this.setState({
        slideDirection: "right"
      });
    }

    let newPosition = this.state.position - 1;
    if (newPosition < 1) newPosition = 1;
    this.updatePosition(newPosition);
  };

  handleSlideNext = () => {
    if (this.state.slideDirection !== "left") {
      this.setState({
        slideDirection: "left"
      });
    }

    let newPosition = this.state.position + 1;
    if (newPosition > this.state.totalCount)
      newPosition = this.state.totalCount;
    this.updatePosition(newPosition);
  };

  isLoaded(position) {
    return this.state.map.hasOwnProperty(position);
  }

  positionToPage(position, perPage) {
    return Math.ceil(position / perPage);
  }

  isPageLoaded(page) {
    return includes(this.state.loadedPages, page);
  }

  current() {
    return this.state.map[this.state.currentPosition];
  }

  updateMap(collectionResources, pagination) {
    const map = this.buildNewMap(collectionResources, pagination);
    this.setState({ map });
  }

  updatePosition(newPosition) {
    if (!this.isLoaded(newPosition)) {
      this.handleUnloadedSlide(newPosition);
    }
    this.setState({ position: newPosition });
  }

  buildNewMap(collectionResources, pagination) {
    const updates = {};
    const start = pagination.perPage * (pagination.currentPage - 1) + 1;
    collectionResources.forEach((collectionResource, index) => {
      updates[start + index] = collectionResource;
    });
    return Object.assign({}, this.state.map, updates);
  }

  renderSlideShow() {
    const position = this.state.position;
    const collectionResource = this.state.map[position];

    return (
      <div key={position}>
        {this.isLoaded(position) ? (
          this.getFigureByType(collectionResource)
        ) : (
          <ResourceList.Slide.SlideLoading />
        )}
      </div>
    );
  }

  renderPlaceholder() {
    return <ResourceList.Slide.SlidePlaceholder />;
  }

  render() {
    const position = this.state.position;
    const totalCount = this.state.totalCount;
    const collectionResource = this.state.map[position];

    return (
      <div className="resource-slideshow">
        {/*
          Note that .slide may be abstracted to a
          listed format to support multiple, sliding images
        */}
        <div className="slide">
          <Swipeable
            onSwipedLeft={this.handleSlideNext}
            onSwipedRight={this.handleSlidePrev}
          >
            {/* Concatenate a reactive transition name */}
            <div className="resource-slide-figure">
              <ReactCSSTransitionGroup
                transitionName={`slide-${this.state.slideDirection}`}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
              >
                {this.props.collectionResources.length > 0
                  ? this.renderSlideShow()
                  : this.renderPlaceholder()}
              </ReactCSSTransitionGroup>
            </div>
          </Swipeable>
          <div className="slide-footer">
            {this.isLoaded(position) ? (
              <ResourceList.Slide.Caption
                resource={collectionResource}
                collection={this.props.collection}
                hideDetailUrl={this.props.hideDetailUrl}
                hideDownload={this.props.hideDownload}
              />
            ) : (
              <ResourceList.Slide.LoadingCaption />
            )}
            {this.props.collectionResources.length > 0 ? (
              <div className="slide-pagination">
                <span className="slide-ordinal">
                  {position} {"/"} {totalCount}
                </span>
                <div>
                  <button
                    className="slide-previous"
                    onClick={this.handleSlidePrev}
                    disabled={position === 1}
                  >
                    <i
                      className="manicon manicon-arrow-left"
                      aria-hidden="true"
                    />
                    <i
                      className="manicon manicon-arrow-round-left"
                      aria-hidden="true"
                    />
                    <span className="text" aria-hidden="true">
                      Prev
                    </span>
                    <span className="screen-reader-text">
                      {"Go to previous slide"}
                    </span>
                  </button>
                  <button
                    className="slide-next"
                    onClick={this.handleSlideNext}
                    disabled={position === totalCount}
                  >
                    <span className="text" aria-hidden="true">
                      Next
                    </span>
                    <span className="screen-reader-text">
                      {"Go to next slide"}
                    </span>
                    <i
                      className="manicon manicon-arrow-round-right"
                      aria-hidden="true"
                    />
                    <i
                      className="manicon manicon-arrow-right"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
