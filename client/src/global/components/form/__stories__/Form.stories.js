import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import Picker from "../Picker";
import FormContainer from "global/containers/form";
import faker from "faker";

storiesOf("Backend/Form", module).add("Picker", () => {
  const makerResources = fixtures.collectionFactory(
    "maker",
    8,
    (type, index) => ({
      id: `${type}-${index}`,
      attributes: { fullName: faker.name.findName() }
    })
  );

  const makerOptions = [
    { value: "maker-1", label: "First Maker" },
    { value: "maker-2", label: "Second Maker" },
    { value: "maker-3", label: "Third Maker" },
    { value: "maker-4", label: "Fourth Maker" }
  ];

  const update = () => {};
  const create = () => {};

  return (
    <>
      <h2>Single Selects</h2>
      <FormContainer.Form
        name="test-form-select-one"
        model={{ id: 1, attributes: { target: makerOptions[1].value } }}
        style={{ marginBottom: 50 }}
        update={update}
        create={create}
      >
        <Picker
          label="Select One"
          name="attributes[target]"
          options={makerOptions}
          optionToLabel={maker => maker.attributes.fullName}
        />
      </FormContainer.Form>

      <FormContainer.Form
        name="test-form-select-one-resources"
        style={{ marginBottom: 50 }}
        model={{ id: 1, attributes: { target: "maker-3" } }}
        update={update}
        create={create}
      >
        <Picker
          label="Select One (resource options)"
          name="attributes[target]"
          options={makerResources}
          optionToValue={maker => maker.id}
          optionToLabel={maker => maker.attributes.fullName}
        />
      </FormContainer.Form>

      <FormContainer.Form
        name="test-form-select-one-allow-new"
        model={{ id: 1, attributes: { target: makerOptions[1].value } }}
        style={{ marginBottom: 50 }}
        update={update}
        create={create}
      >
        <Picker
          allowNew
          label="Select One, Allow New"
          name="attributes[target]"
          options={makerOptions}
          optionToLabel={maker => maker.attributes.fullName}
        />
      </FormContainer.Form>

      <h2>Multiple Selects</h2>

      <FormContainer.Form
        model={{ id: 1, attributes: { target: [makerOptions[0].value] } }}
        style={{ marginBottom: 50 }}
        name="test-form-select-multiple"
        update={update}
        create={create}
      >
        <Picker
          label="Select Multiple"
          name="attributes[target]"
          options={makerOptions}
          listRowComponent="FormOptionRow"
        />
      </FormContainer.Form>

      <FormContainer.Form
        name="test-form-select-multiple-resource-options"
        model={{ id: 1, attributes: { target: [makerResources[2]] } }}
        style={{ marginBottom: 50 }}
        update={update}
        create={create}
      >
        <Picker
          label="Select Multiple (resource options, maker row component)"
          name="attributes[target]"
          options={makerResources}
          listRowComponent="MakerRow"
          optionToLabel={maker => maker.attributes.fullName}
        />
      </FormContainer.Form>

      <FormContainer.Form
        name="test-form-select-multiple-resource-options-row-style"
        model={{
          id: 1,
          attributes: {
            target: [makerResources[2], makerResources[1], makerResources[4]]
          }
        }}
        style={{ marginBottom: 50 }}
        update={update}
        create={create}
      >
        <Picker
          label="Select Multiple (resource options, maker row component, row list style)"
          name="attributes[target]"
          options={makerResources}
          listRowComponent="MakerRow"
          listStyle="rows"
          optionToLabel={maker => maker.attributes.fullName}
        />
      </FormContainer.Form>

      <FormContainer.Form
        name="test-form-select-multiple-allow-new"
        model={{ id: 1, attributes: { target: [makerOptions[1].value] } }}
        style={{ marginBottom: 50 }}
        update={update}
        create={create}
      >
        <Picker
          label="Select Multiple, Allow New"
          allowNew
          name="attributes[target]"
          options={makerOptions}
          showAddRemoveAll
        />
      </FormContainer.Form>
    </>
  );
});
