# frozen_string_literal: true

module TextSections
  # An operation to maintain the `current` status of {TextSectionNode}s
  # for a given {TextSection}.
  #
  # This operation is intended to be run after {TextSections::ExtrapolateNodes}
  # has been run for a {TextSection}, to ensure that nodes that are no longer
  # part of the current body are marked as not current.
  class MaintainCurrentNodes
    include Dry::Monads[:result, :do]

    # @param [TextSection] text_section
    # @return [Dry::Monads::Result]
    def call(text_section)
      body_hash = text_section.body_hash

      nodes = text_section.text_section_nodes

      orphaned = nodes.where.not(body_hash:).current.update_all(current: false)

      corrected = nodes.where(body_hash:).orphaned.update_all(current: true)

      counts = { orphaned:, corrected: }

      Success counts
    end
  end
end
