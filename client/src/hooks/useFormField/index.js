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
export default function useFormField(name) {
  const context = useContext(FormContext);

  const path = useMemo(() => brackets2dots(name), [name]);

  // Return disconnected state if not inside a Form
  const disconnectedState = useMemo(
    () => ({
      value: undefined,
      initialValue: undefined,
      onChange: () => {},
      set: () => {},
      setOther: () => {},
      errors: [],
      isConnected: false,
      isSubmitting: false
    }),
    []
  );

  const value = useMemo(() => {
    if (!context) return undefined;
    const { dirtyModel, sourceModel } = context;
    if (has(dirtyModel, path)) return get(dirtyModel, path);
    return get(sourceModel, path);
  }, [context, path]);

  const initialValue = useMemo(() => {
    if (!context) return undefined;
    return get(context.sourceModel, path);
  }, [context, path]);

  const set = useCallback(
    (newValue, triggersDirty = true) => {
      if (!context?.actions?.setValue) return;
      context.actions.setValue(path, newValue, triggersDirty);
    },
    [context, path]
  );

  const setOther = useCallback(
    (otherName, newValue, triggersDirty = true) => {
      if (!context?.actions?.setValue) return;
      const otherPath = brackets2dots(otherName);
      context.actions.setValue(otherPath, newValue, triggersDirty);
    },
    [context]
  );

  // onChange handler for native inputs
  const onChange = useCallback(
    event => {
      set(event.target.value);
    },
    [set]
  );

  // Filter errors for this field
  const errors = useMemo(() => {
    if (!context?.errors) return [];
    return context.errors.filter(err => {
      const pointer = err.source?.pointer || "";
      // Match by path or original name
      return pointer.includes(path) || pointer.includes(name);
    });
  }, [context?.errors, path, name]);

  if (!context) return disconnectedState;

  return {
    value,
    initialValue,
    onChange,
    set,
    setOther,
    errors,
    isConnected: true,
    isSubmitting: context.isSubmitting || false
  };
}
