import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Dialog } from "components/backend";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { makersAPI, requests } from "api";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
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
    this.updateUsers = this.updateUsers.bind(this);
  }

  componentDidMount() {
    this.fetchMaker(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetchMaker(nextProps.match.params.id);
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

  handleMakerDestroy(event, maker) {
    const heading = "Are you sure you want to delete this maker?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.destroyMaker(maker);
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
  }

  destroyMaker(maker) {
    const call = makersAPI.destroy(maker.id);
    const options = { removes: maker };
    const makerRequest = request(call, requests.beMakerDestroy, options);
    this.props.dispatch(makerRequest).promise.then(() => {
      this.props.history.push(lh.link("backendPeopleMakers"));
    });
  }

  updateUsers(users, changeTypeIgnored) {
    const adjustedUsers = users.map(e => {
      return {
        id: e.id,
        type: e.type
      };
    });
    const maker = {
      type: this.props.maker.type,
      id: this.props.maker.id,
      relationships: { users: { data: adjustedUsers } }
    };
    const call = makersAPI.update(maker.id, maker);
    const userRequest = request(call, requests.beMakerUpdate);
    this.props.dispatch(userRequest);
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
          <h2 className="heading-quaternary">{attr.fullName}</h2>
          <HigherOrder.Authorize entity={maker} ability="delete">
            <div className="buttons-bare-vertical">
              <button
                className="button-bare-primary"
                onClick={event => {
                  this.handleMakerDestroy(event, maker);
                }}
              >
                {"Delete Maker"}
                <i className="manicon manicon-trashcan" />
              </button>
            </div>
          </HigherOrder.Authorize>
        </header>
        <section className="form-section">
          <FormContainer.Form
            model={maker}
            name="backend-maker-update"
            update={makersAPI.update}
            create={makersAPI.create}
            className="form-secondary"
            notificationScope="drawer"
          >
            <Form.TextInput
              label="First Name"
              name="attributes[firstName]"
              placeholder="First Name"
            />
            <Form.TextInput
              label="Middle Name"
              name="attributes[middleName]"
              placeholder="Middle Name"
            />
            <Form.TextInput
              label="Last Name"
              name="attributes[lastName]"
              placeholder="Last Name"
            />
            <Form.TextInput
              label="Suffix"
              name="attributes[suffix]"
              placeholder="Suffix"
            />
            <Form.Upload
              layout="square"
              accepts="images"
              label="Avatar Image"
              readFrom="attributes[avatarStyles][smallSquare]"
              name="attributes[avatar]"
              remove="attributes[removeAvatar]"
            />
            <Form.Save text="Save Maker" />
          </FormContainer.Form>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(MakersEditContainer);
