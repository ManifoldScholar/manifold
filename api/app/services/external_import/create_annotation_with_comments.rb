module ExternalImport
  class CreateAnnotationWithComments < ActiveInteraction::Base
    import_filters ExternalImport::CreateAnnotation

    array :comments, default: proc { [] } do
      hash strip: false
    end

    # @return [Annotation]
    def execute
      attributes = inputs.merge(type: "annotation")

      annotation = compose ExternalImport::CreateAnnotation, attributes

      comments.each do |definition|
        compose ExternalImport::CreateComment, definition.merge(annotation: annotation)
      end
    end
  end
end
