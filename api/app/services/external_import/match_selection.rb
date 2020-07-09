module ExternalImport
  class MatchSelection < ActiveInteraction::Base
    object :import_selection

    boolean :reset_matches, default: false

    delegate :already_matched?, :short_body?, to: :import_selection
    # rubocop:disable Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/AbcSize, Layout/DotPosition
    def execute
      if already_matched?
        return unless reset_matches

        import_selection.import_selection_matches.destroy_all
      end

      return if short_body?

      # TODO: This will no longer work after Searchable Nodes are removed. Needs to be
      # updated.
      @found_nodes = SearchableNode.
        in_texts(import_selection.text_id).
        includes(:text_section).
        containing_sentence(import_selection.body)

      case @found_nodes.count
      when 0
        return
      when 1
        create_match! @found_nodes.first if @found_nodes.size == 1
      else
        @fuzzy_match = FuzzyMatch.new(@found_nodes.all, read: :content)

        found = @fuzzy_match.find import_selection.body

        return create_match! found if found.present?

        # Else create multiple matches
        @found_nodes.find_each do |node|
          create_match! node
        end
      end
    end

    private

    def create_match!(node)
      match = import_selection.
        import_selection_matches.
        where(searchable_node: node).first_or_initialize

      match.text_section = node.text_section

      match.save!

      compose ExternalImport::MatchRange, import_selection_match: match
    end
    # rubocop:enable Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/AbcSize, Layout/DotPosition

  end
end
