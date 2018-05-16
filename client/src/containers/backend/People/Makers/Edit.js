import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Dialog } from "components/backend";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { makersAPI, requests } from "api";
import { People } from "containers/backend";
import { HigherOrder } from "containers/global";
import get from "lodash/get";
import lh from "helpers/linkHandler";

const { request, flush } = entityStoreActions;

export class MakersEditContainer extends PureComponent {
  static displayName = "Makers.Edit";

  static propTypes = {
    maker: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    afterDestroy: PropTypes.func,
    dispatch: PropTypes.func
  };

  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      maker: select(requests.beMaker, state.entityStore),
      updateMakers: get(state.entityStore.responses, requests.beMakerUpdate)
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
  }

  componentDidMount() {
    this.fetchMaker(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchMaker(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.beMakerUpdate]));
  }

  fetchMaker(id) {
    const call = makersAPI.show(id);
    const makerRequest = request(call, requests.beMaker);
    this.props.dispatch(makerRequest);
  }

  handleMakerDestroy = () => {
    const heading = "Are you sure you want to delete this maker?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.destroyMaker();
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
  };

  destroyMaker() {
    const maker = this.props.maker;
    const call = makersAPI.destroy(maker.id);
    const options = { removes: maker };
    const makerRequest = request(call, requests.beMakerDestroy, options);
    this.props.dispatch(makerRequest).promise.then(() => {
      this.doAfterDestroy(this.props);
    });
  }

  doAfterDestroy(props) {
    if (props.afterDestroy) return props.afterDestroy();
    return props.history.push(lh.link("backendPeopleMakers"));
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  render() {
    if (!this.props.maker) return null;
    const attr = this.props.maker.attributes;
    const maker = this.props.maker;

    return (
      <div>
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}
        <header className="drawer-header">
          <h2 className="heading-quaternary">
            {attr.fullName}
          </h2>
          <HigherOrder.Authorize entity={maker} ability="delete">
            <div className="buttons-bare-vertical">
              <button
                className="button-bare-primary"
                onClick={this.handleMakerDestroy}
              >
                {"Delete Maker"}
                <i className="manicon manicon-trashcan" aria-hidden="true"/>
              </button>
            </div>
          </HigherOrder.Authorize>
        </header>
        <People.Makers.Form maker={maker} />
      </div>
    );
  }
}

export default connectAndFetch(MakersEditContainer);
