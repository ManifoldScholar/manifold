import { useState, useCallback } from "react";
import { useRevalidator } from "react-router";
import { useAfterRevalidate } from "hooks";

export default function useSubmitAnnotation({
  annotation,
  body,
  readingGroupId,
  saveAnnotation,
  closeOnSave,
  cancel
}) {
  const revalidator = useRevalidator();
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRevalidating, setIsRevalidating] = useAfterRevalidate(
    cancel,
    !(cancel && closeOnSave)
  );

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();
      setErrors([]);
      setIsSubmitting(true);

      try {
        const updatedAnnotation = {
          ...annotation,
          attributes: {
            ...annotation.attributes,
            body,
            private: readingGroupId === "private",
            readingGroupId:
              readingGroupId !== "private" && readingGroupId !== "public"
                ? readingGroupId
                : null
          }
        };

        await saveAnnotation(updatedAnnotation);
        revalidator.revalidate();
        setIsRevalidating(true);
      } catch (error) {
        setErrors(
          error.body?.errors || [
            {
              detail: error.message || "Failed to save annotation",
              source: { pointer: "/data" }
            }
          ]
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      annotation,
      body,
      readingGroupId,
      saveAnnotation,
      revalidator,
      setIsRevalidating
    ]
  );

  return {
    handleSubmit,
    errors,
    loading: isSubmitting || isRevalidating
  };
}
