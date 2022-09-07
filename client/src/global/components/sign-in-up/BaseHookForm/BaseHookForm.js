import React, { useState, useEffect, useCallback, forwardRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useApiCallback } from "hooks";
import * as Styled from "./styles";

const BaseHookForm = forwardRef((props, ref) => {
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
    onError,
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
        .catch(err => {
          setErrors(err.body?.errors);
          if (onError) onError(err);
        });
    },
    [formatData, onSuccess, onError, triggerCall]
  );

  useEffect(() => {
    reset();
  }, [resetDep, reset]);

  return (
    <FormProvider {...form}>
      <Styled.Form
        ref={ref}
        tabIndex={-1}
        onSubmit={handleSubmit(onSubmitWithRequest)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={className}
      >
        {children(errors, form)}
      </Styled.Form>
    </FormProvider>
  );
});

export default BaseHookForm;
