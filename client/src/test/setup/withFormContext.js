/* global $getModelValue */
import FormContext from "helpers/contexts/FormContext";
import React from "react";

def("getModelValue", () => jest.fn());
def("withFormContext", () => {
  return (component, { getModelValue = null, sourceModel = {} } = {}) => {
    const _getModelValue = getModelValue || $getModelValue;
    return (
      <FormContext.Provider
        value={{
          getModelValue: _getModelValue,
          sourceModel
        }}
      >
        {component}
      </FormContext.Provider>
    );
  };
});
