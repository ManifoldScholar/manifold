# frozen_string_literal: true

module TextSections
  # A remedial operation that corrects past extrapolated nodes
  # that should be set to intermediate based on their tag.
  #
  # This ensures that as we refine the extrapolation algorithm,
  # historical annotations can take advantage of the improved
  # structure.
  class CorrectIntermediateNodes
    include Dry::Monads[:result]

    # @param [TextSection, nil] text_section
    # @return [Dry::Monads::Success(Integer)]
    def call(text_section: nil, **)
      query = ::TextSectionNode.with_intermediate_tag.terminal

      query = query.where(text_section: text_section) if text_section.present?

      corrected = query.update_all(intermediate: true)

      Success corrected
    end
  end
end
