module Annotations
  module Operations
    class Clone
      extend Dry::Initializer

      include MonadicPersistence

      include Dry::Monads[:do, :result]

      CLONED_ATTRIBUTES = %i[
        creator_id reading_group_id resource_id text_section_id
        start_node end_node start_char end_char
        format subject body private
      ].freeze

      param :annotation, model: "Annotation"

      option :overrides, Types::Hash, optional: true

      def call
        attributes = annotation.slice(*CLONED_ATTRIBUTES)

        new_annotation = Annotation.new attributes

        new_annotation.assign_attributes(overrides) if overrides.present?

        monadic_save new_annotation
      end
    end
  end
end
