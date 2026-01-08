import { useContext, useCallback, useMemo } from "react";
import { FormContext } from "helpers/contexts";
import { brackets2dots } from "utils/string";
import get from "lodash/get";
import has from "lodash/has";

/**
 * Hook for connecting a form input to the Form container.
 * Replaces the `setter` HOC
 *
 * @param {string} name - Field name (e.g., "attributes[title]" or "attributes.title")
 * @param {object} options - Optional configuration
 * @param {any} options.controlledValue - Field value when using as a controlled component
 * @param {function} options.controlledOnChange - Change handler when using as controlled
 * @param {function} options.beforeOnChange - Callback called before value change (currentValue, newValue, event) => any|Promise
 * @param {function} options.transformValue - Optional function to transform the value before setting (newValue) => transformedValue
 * @param {array} options.controlledErrors - Optional external errors to merge with form errors
 * @returns {object} Form field state and handlers
 *
 * @example
 * function TextInput({ name, label }) {
 *   const { value, onChange, errors } = useFormField(name);
 *   return (
 *     <div>
 *       <label>{label}</label>
 *       <input value={value ?? ''} onChange={onChange} />
 *       {errors.map(e => <span key={e.detail}>{e.detail}</span>)}
 *     </div>
 *   );
 * }
 */
export default function useFormField(name, options = {}) {
  const {
    controlledValue,
    controlledOnChange,
    controlledErrors,
    beforeOnChange,
    transformValue
  } = options;
  const context = useContext(FormContext);
  const path = useMemo(() => brackets2dots(name), [name]);

  const value = useMemo(() => {
    if (!context) return undefined;
    const { dirtyModel, sourceModel } = context;
    if (has(dirtyModel, path)) return get(dirtyModel, path);
    return get(sourceModel, path);
  }, [context, path]);

  const set = useCallback(
    // Optional otherName to set a different field's value
    (newValue, triggersDirty = true, otherName) => {
      if (!context?.actions?.setValue) return;

      let pathToSet = path;
      if (otherName) {
        pathToSet = brackets2dots(otherName);
      }
      context.actions.setValue(pathToSet, newValue, triggersDirty);
    },
    [context, path]
  );

  const onChange = useCallback(
    event => {
      const newValue = event.target.value === "" ? null : event.target.value;
      const transformedValue = transformValue
        ? transformValue(newValue)
        : newValue;

      const doChange = () => {
        // Mutate event.target.value with transformed value if needed
        if (transformValue) {
          // eslint-disable-next-line no-param-reassign
          event.target.value = transformedValue;
        }
        set(transformedValue);
      };

      // Handle beforeOnChange callback if provided
      if (beforeOnChange) {
        const result = beforeOnChange(value, newValue, event);
        // If beforeOnChange returns a promise, wait for it
        if (result && typeof result.then === "function") {
          result.then(
            () => {
              doChange();
            },
            () => {}
          );
          return;
        }
      }

      doChange();
    },
    [set, value, beforeOnChange, transformValue]
  );

  const errors = useMemo(() => {
    if (!context?.errors) return [];
    return context.errors.filter(err => {
      const pointer = err.source?.pointer || "";
      // Match by path or original name
      return pointer.includes(path) || pointer.includes(name);
    });
  }, [context?.errors, path, name]);

  // Pass through controlled state if not inside a Form
  // Replaces previous "Unwrapped" exports
  const controlledState = useMemo(
    () => ({
      value: controlledValue,
      onChange: controlledOnChange,
      set: () => {},
      errors: controlledErrors || [],
      isSubmitting: false
    }),
    [controlledValue, controlledOnChange, controlledErrors]
  );

  if (!context || !name || controlledValue) return controlledState;

  return {
    value,
    onChange,
    set,
    errors,
    isSubmitting: context.isSubmitting || false
  };
}
