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
 * @param {any} controlledValue - Field value when using as a controlled component
 * @param {function} controlledOnChange - Change handler when using as controlled
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
export default function useFormField(
  name,
  controlledValue,
  controlledOnChange
) {
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

  // onChange handler for native inputs
  const onChange = useCallback(
    event => {
      set(event.target.value);
    },
    [set]
  );

  const errors = useMemo(() => {
    if (!context?.errors) return [];
    return context.errors.filter(err => {
      const pointer = err.source?.pointer || "";
      // Match by path or original name
      return pointer.includes(path) || pointer.includes(name);
    });
  }, [context?.errors, path, name]);

  // Return controlled state if not inside a Form
  // Replaces previous "Unwrapped" exports
  const controlledState = useMemo(
    () => ({
      value: controlledValue,
      onChange: controlledOnChange,
      set: () => {},
      errors: [],
      isSubmitting: false
    }),
    [controlledValue, controlledOnChange]
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
