import { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Developer from "global/components/developer";
import get from "lodash/get";
import has from "lodash/has";
import set from "lodash/set";
import unset from "lodash/unset";
import isFunction from "lodash/isFunction";
import isPlainObject from "lodash/isPlainObject";
import { brackets2dots } from "utils/string";
import NavigationBlocker from "global/components/router/NavigationBlocker";
import { FormContext } from "helpers/contexts";
import { areValuesEqualish, hasChanges, adjustRelationships } from "./helpers";
import * as Styled from "./styles";

export default function FormContainer({
  model,
  children,
  fetcher,
  submit,
  action,
  errors: errorsProp = [],
  onDirty,
  formatData,
  doNotWarn = false,
  debug = false,
  groupErrors = false,
  groupErrorsStyle,
  className = "form-secondary",
  style = {},
  formRef
}) {
  const { t } = useTranslation();

  const defaultModel = useMemo(
    () => ({ attributes: {}, relationships: {} }),
    []
  );
  const initialModel = model || defaultModel;

  const [source, setSource] = useState(initialModel);
  const [dirty, setDirty] = useState({ attributes: {}, relationships: {} });
  const [changed, setChanged] = useState(false);

  // Reset form when model changes
  useEffect(() => {
    setSource(initialModel);
    setDirty({ attributes: {}, relationships: {} });
    setChanged(false);
  }, [initialModel]);

  // Notify parent of dirty state changes
  useEffect(() => {
    if (onDirty) onDirty(changed);
  }, [changed, onDirty]);

  const setValue = useCallback(
    (path, value, triggersDirty = true) => {
      if (value === undefined) return;

      const sourceValue = get(source, path);

      setDirty(prevDirty => {
        const newDirty = { ...prevDirty };

        // If new value matches source value, unset from dirty
        if (areValuesEqualish(value, sourceValue)) {
          unset(newDirty, path);
          // Handle nested hash cleanup
          const depth = path.split(".").length;
          if (depth > 2) {
            const parentPath = path.substr(0, path.lastIndexOf("."));
            const parent = get(newDirty, parentPath);
            if (isPlainObject(parent) && Object.keys(parent).length === 0) {
              unset(newDirty, parentPath);
            }
          }
        } else {
          set(newDirty, path, value);
        }

        // Update changed state if this triggers dirty
        if (triggersDirty) {
          setChanged(hasChanges(newDirty, source));
        }

        return newDirty;
      });
    },
    [source]
  );

  const getModelValue = useCallback(
    inputName => {
      const path = brackets2dots(inputName);
      if (has(dirty, path)) return get(dirty, path);
      if (has(source, path)) return get(source, path);
      return null;
    },
    [dirty, source]
  );

  const handleSubmit = useCallback(
    event => {
      if (event) event.preventDefault();

      const data = formatData
        ? formatData(dirty, source)
        : {
            attributes: { ...source.attributes, ...dirty.attributes },
            relationships: adjustRelationships(dirty.relationships)
          };

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      if (fetcher) {
        fetcher.submit(formData, {
          method: "post",
          ...(action ? { action } : {})
        });
      } else if (submit) {
        submit(formData, { method: "post" });
      }
    },
    [dirty, source, formatData, fetcher, submit, action]
  );

  // Errors from fetcher.data or passed prop (from actionData)
  const errors = fetcher?.data?.errors || errorsProp;

  const contextValue = useMemo(
    () => ({
      actions: { setValue },
      dirtyModel: dirty,
      sourceModel: source,
      getModelValue,
      triggerSubmit: handleSubmit,
      isSubmitting: fetcher?.state === "submitting",
      styleType: className.includes("form-secondary") ? "secondary" : "primary",
      ...(groupErrors ? {} : { errors })
    }),
    [
      setValue,
      dirty,
      source,
      getModelValue,
      handleSubmit,
      className,
      groupErrors,
      errors,
      fetcher.state
    ]
  );

  const isBlocking = !doNotWarn && !fetcher?.data?.success && changed;

  return (
    <>
      {debug && <Developer.Debugger object={{ source, dirty, errors }} />}
      <NavigationBlocker
        when={isBlocking}
        message={t("messages.unsaved_changes")}
      />
      {groupErrors && errors?.length > 0 && (
        <Styled.ErrorGroup
          containerStyle={groupErrorsStyle}
          name="*"
          errors={errors}
        />
      )}
      <Styled.Form
        ref={formRef}
        style={style}
        onSubmit={handleSubmit}
        className={className}
        data-id="submit"
      >
        <FormContext.Provider value={contextValue}>
          {isFunction(children) ? children(getModelValue) : children}
        </FormContext.Provider>
      </Styled.Form>
    </>
  );
}

FormContainer.displayName = "Form.Form";

FormContainer.propTypes = {
  model: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
    PropTypes.element
  ]),
  fetcher: PropTypes.shape({
    submit: PropTypes.func.isRequired,
    state: PropTypes.string,
    data: PropTypes.object
  }),
  submit: PropTypes.func,
  action: PropTypes.string,
  errors: PropTypes.array,
  onDirty: PropTypes.func,
  formatData: PropTypes.func,
  doNotWarn: PropTypes.bool,
  debug: PropTypes.bool,
  groupErrors: PropTypes.bool,
  groupErrorsStyle: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
  formRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ])
};
