import { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import ResourceList from "./panels/Resources";
import CollectionList from "./panels/Collections";
import CreateForm from "./panels/Create";
import IconComposer from "global/components/utility/IconComposer";
import Tabs from "frontend/components/layout/Tabs";
import * as Styled from "./styles";

export default function NewResourceAnnotation({ projectId, actions, close }) {
  const { t } = useTranslation();

  const [selected, setSelected] = useState(null);

  const handleSave = e => {
    e.preventDefault();
    actions.openResourceAnnotationFormatModal(selected);
  };

  const tabs = [
    {
      label: t("glossary.resource_other"),
      id: "resources",
      icon: "resource24",
      panel: (
        <ResourceList
          projectId={projectId}
          selected={selected}
          setSelected={setSelected}
          handleSave={handleSave}
          handleClose={close}
        />
      )
    },
    {
      label: t("glossary.collection_other"),
      id: "collections",
      icon: "resourceCollection64",
      panel: (
        <CollectionList
          projectId={projectId}
          selected={selected}
          setSelected={setSelected}
          handleSave={handleSave}
          handleClose={close}
        />
      )
    },
    {
      label: "Create New",
      id: "create",
      icon: "circlePlus24",
      panel: (
        <CreateForm
          projectId={projectId}
          onSuccess={actions.openResourceAnnotationFormatModal}
        />
      )
    }
  ];

  return (
    <Styled.Wrapper>
      <Styled.Heading>
        <h2>Add a Resource Annotation</h2>
        <p>Description text goes here...</p>
      </Styled.Heading>
      <Tabs.Provider initActive="resources">
        <div>
          <Styled.Label>Resource Type</Styled.Label>
          <Styled.TabList>
            {tabs.map(tab => {
              return (
                <Tabs.Tab key={tab.id} id={tab.id} $count={tabs.length}>
                  <IconComposer icon={tab.icon} size={32} />
                  <span>{tab.label}</span>
                </Tabs.Tab>
              );
            })}
          </Styled.TabList>
          {tabs.map(tab => {
            return (
              <Tabs.Panel key={tab.id} id={tab.id}>
                {tab.panel}
              </Tabs.Panel>
            );
          })}
        </div>
      </Tabs.Provider>
    </Styled.Wrapper>
  );
}

NewResourceAnnotation.drawerProps = {
  context: "reader",
  padding: "default",
  title: null
};

NewResourceAnnotation.propTypes = {
  projectId: PropTypes.string,
  actions: PropTypes.object,
  close: PropTypes.func
};
