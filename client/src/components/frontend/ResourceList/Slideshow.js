import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import Swipeable from "react-swipeable";
import includes from "lodash/includes";
import { ResourceList } from "components/frontend";
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

    this.current = this.current.bind(this);
    this.updateMap = this.updateMap.bind(this);
    this.buildNewMap = this.buildNewMap.bind(this);
    this.handleSlidePrev = this.handleSlidePrev.bind(this);
    this.handleSlideNext = this.handleSlideNext.bind(this);
    this.handleUnloadedSlide = this.handleUnloadedSlide.bind(this);
    this.addLoadedPage = this.addLoadedPage.bind(this);
    this.updateTotalCount = this.updateTotalCount.bind(this);
    this.bindKeyboard = this.bindKeyboard.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keyup", this.bindKeyboard, false);
  }

  componentWillReceiveProps(nextProps) {
    this.updateMap(nextProps.collectionResources, nextProps.pagination);
    this.addLoadedPage(nextProps.pagination.currentPage);
    this.updateTotalCount(nextProps.pagination.totalCount);
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
    return <Slide resource={resource} {...this.props.slideOptions} />;
  }

  bindKeyboard(event) {
    if (event.keyCode === 39) {
      this.handleSlideNext();
    } else if (event.keyCode === 37) {
      this.handleSlidePrev();
    }
  }

  handleUnloadedSlide(position) {
    const page = this.positionToPage(position, this.props.pagination.perPage);
    if (!this.isPageLoaded(page)) {
      const fetch = collectionsAPI.collectionResources(
        this.props.collection.id,
        {},
        { number: page, size: this.props.pagination.perPage }
      );
      this.props.dispatch(request(fetch, requests.feSlideshow));
    }
  }

  handleSlidePrev() {
    if (this.state.slideDirection !== "right") {
      this.setState({
        slideDirection: "right"
      });
    }

    let newPosition = this.state.position - 1;
    if (newPosition < 1) newPosition = 1;
    this.updatePosition(newPosition);
  }

  handleSlideNext() {
    if (this.state.slideDirection !== "left") {
      this.setState({
        slideDirection: "left"
      });
    }

    let newPosition = this.state.position + 1;
    if (newPosition > this.state.totalCount)
      newPosition = this.state.totalCount;
    this.updatePosition(newPosition);
  }

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
    const collectionResource = this.state.map[this.state.currentPosition];
    return collectionResource;
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

  updateTotalCount(totalCount) {
    if (totalCount > 0) {
      this.setState({ totalCount });
    }
  }

  buildNewMap(collectionResources, pagination) {
    const updates = {};
    const start = pagination.perPage * (pagination.currentPage - 1) + 1;
    collectionResources.forEach((collectionResource, index) => {
      updates[start + index] = collectionResource;
    });
    const map = Object.assign({}, this.state.map, updates);
    return map;
  }

  addLoadedPage(page) {
    const loadedPages = this.state.loadedPages.slice(0);
    if (!includes(loadedPages, page)) {
      loadedPages.push(page);
      this.setState({ loadedPages });
    }
  }

  renderSlideShow() {
    const position = this.state.position;
    const collectionResource = this.state.map[position];

    return (
      <div key={position}>
        {this.isLoaded(position)
          ? this.getFigureByType(collectionResource)
          : <ResourceList.Slide.SlideLoading />}
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
            {this.isLoaded(position)
              ? <ResourceList.Slide.Caption
                  resource={collectionResource}
                  collection={this.props.collection}
                  hideDetailUrl={this.props.hideDetailUrl}
                  hideDownload={this.props.hideDownload}
                />
              : <ResourceList.Slide.LoadingCaption />}
            {this.props.collectionResources.length > 0
              ? <div className="slide-pagination">
                  <span className="slide-ordinal">
                    {position} {"/"} {totalCount}
                  </span>
                  <div>
                    <button
                      className="slide-previous"
                      onClick={this.handleSlidePrev}
                      disabled={position === 1}
                    >
                      <i className="manicon manicon-arrow-left" />
                      <i className="manicon manicon-arrow-round-left" />
                      <span className="text">Prev</span>
                      <span className="screen-reader-text">
                        {"Click to load previous slide"}
                      </span>
                    </button>
                    <button
                      className="slide-next"
                      onClick={this.handleSlideNext}
                      disabled={position === totalCount}
                    >
                      <span className="text">Next</span>
                      <span className="screen-reader-text">
                        {"Click to load next slide"}
                      </span>
                      <i className="manicon manicon-arrow-round-right" />
                      <i className="manicon manicon-arrow-right" />
                    </button>
                  </div>
                </div>
              : null}
          </div>
        </div>
      </div>
    );
  }
}
