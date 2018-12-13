module Updaters
  # Updates a ContentBlock model from JSON-API style params
  class ContentBlock
    include ::Updaters

    set_callback :update_relationships, :before, :adjust_reference_associations!

    delegate :content_block_references, to: :@model
    delegate :reference_configurations, to: :@model
    delegate :reference_configuration, to: :@model
    delegate :reference_associations, to: :@model


    private

    def update_relationships!(_model)
      clone = relationships.clone.with_indifferent_access

      relationships = reference_associations.map do |kind, _records|
        association = clone.delete kind
        next if association.nil?
        configuration = reference_configuration(kind)

        [association.dig("data")].map do |attr|
          create_content_block_reference kind, attr["id"], configuration.source
        end
      end.flatten

      assign_association! relationships
    end

    def assign_association!(relationships)
      return unless relationships.present?
      @model.content_block_references = relationships
    end

    def create_content_block_reference(kind, id, type)
      content_block_references.find_or_initialize_by kind: kind,
                                                 referencable_id: id,
                                                 referencable_type: type
    end
  end
end
