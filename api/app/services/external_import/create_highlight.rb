module ExternalImport
  class CreateHighlight < ActiveInteraction::Base
    import_filters ExternalImport::CreateAnnotation

    # @return [Annotation]
    def execute
      compose ExternalImport::CreateAnnotation, inputs.merge(type: "highlight")
    end
  end
end
