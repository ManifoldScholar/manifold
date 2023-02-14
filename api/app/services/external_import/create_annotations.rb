module ExternalImport
  class CreateAnnotations < ActiveInteraction::Base
    object :import_selection

    def execute
      return unless import_selection.matches_count == 1

      match = import_selection.import_selection_matches.first!

      return unless match.has_range?

      shared_inputs = match.to_annotation_attributes

      import_selection[:comments].each do |definition|
        compose ExternalImport::CreateAnnotationWithComments, definition.merge(shared_inputs)
      end

      import_selection[:highlights].each do |definition|
        compose ExternalImport::CreateHighlight, definition.merge(shared_inputs)
      end

      import_selection.touch :imported_at
    end
  end
end
