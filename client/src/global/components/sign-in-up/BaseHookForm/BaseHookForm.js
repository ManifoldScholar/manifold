import React, { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useApiCallback } from "hooks";

export default function BaseHookForm(props) {
  const {
    defaultValues,
    formatData,
    ariaLabelledBy,
    ariaLabel,
    children,
    className,
    apiMethod,
    apiOptions,
    onSuccess,
    resetDep
  } = props;

  const form = useForm({
    defaultValues,
    criteriaMode: "all",
    mode: "onSubmit"
  });
  const { handleSubmit, reset } = form;

  const triggerCall = useApiCallback(apiMethod, apiOptions);

  const [errors, setErrors] = useState([]);

  const onSubmitWithRequest = useCallback(
    data => {
      const args = formatData ? formatData(data) : data;
      triggerCall(args)
        .then(res => {
          if (onSuccess) onSuccess(res, data);
        })
        .catch(err => setErrors(err.body?.errors));
    },
    [formatData, onSuccess, triggerCall]
  );

  useEffect(() => {
    reset();
  }, [resetDep, reset]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmitWithRequest)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={className}
      >
        {children(errors)}
      </form>
    </FormProvider>
  );
}
