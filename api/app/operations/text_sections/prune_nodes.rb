# frozen_string_literal: true

module TextSections
  class PruneNodes
    include Dry::Monads[:result]

    # @param [TextSection] text_section
    # @return [Dry::Monads::Success(Integer)]
    def call(text_section)
      # :nocov:
      # We preserve old nodes if there are any annotations
      # for now. In the future, we need to determine if the
      # annotations actually reference the nodes being kept.
      return Success(0) if text_section.annotations.exists?
      # :nocov:

      pruned = text_section.text_section_nodes.orphaned.delete_all

      Success pruned
    end
  end
end
