module ExternalImport
  class MatchRange < ActiveInteraction::Base
    object :import_selection_match

    delegate :searchable_node, :selection_body, to: :import_selection_match

    delegate :content, to: :searchable_node, prefix: :searchable

    # @return [void]
    def execute
      start = searchable_content.index(selection_body)

      unless start.present?
        sub_selected_body = selection_body[/\A([A-Za-z0-9]+)/, 1]

        return if sub_selected_body.blank?

        start = searchable_content.index(sub_selected_body)
      end

      return unless start.present?

      import_selection_match.start_char = start

      import_selection_match.end_char = start + selection_body.length

      import_selection_match.save!
    end
  end
end
