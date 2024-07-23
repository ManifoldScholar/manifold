# frozen_string_literal: true

module Annotations
  # @api private
  # @see Annotations::AdoptOrOrphan
  class AdoptionAssignment < ::Types::FlexibleStruct
    include ActiveModel::Validations

    # A type for matching {#start_char} and {#end_char}
    Index = ::Types::Coercible::Integer.constrained(gteq: 0).fallback { nil }

    # A type for matching {#start_node} and {#end_node}
    Node = ::Types::Coercible::String.constrained(filled: true).fallback { nil }

    attribute? :start_node, Node.optional
    attribute? :end_node, Node.optional

    attribute? :start_char, Index.optional
    attribute? :end_char, Index.optional

    validates :start_node, :end_node, :start_char, :end_char, presence: true

    # @param [Annotation] annotation
    # @return [Annotation]
    def adopt!(annotation)
      annotation.update! to_adopt

      return annotation
    end

    # @return [Hash]
    def to_adopt
      slice(:start_node, :end_node, :start_char, :end_char).merge(orphaned: false)
    end
  end
end
