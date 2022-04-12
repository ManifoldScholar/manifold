module Updaters
  # Updates a Project model from JSON-API style params
  class Project

    include ::Updaters
    include ::Updaters::Concerns::HasSortableCollaborators

    def attachment_fields
      [:avatar, :hero, :cover]
    end

    def adjusted_attributes
      return {} unless attributes

      clone = attributes.clone
      clone.delete(:journal_issue_number)
      clone.delete(:journal_issue_pending_sort_title)
      hashtag!(clone)
      clone
    end

    # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    def post_update(model)
      @model = model
      return unless model.journal_issue

      touched = false
      if attributes.key?("journal_issue_number") && attributes["journal_issue_number"].present?
        model.journal_issue.number = attributes["journal_issue_number"]
        touched = true
      end
      if attributes.key? "journal_issue_pending_sort_title"
        model.journal_issue.pending_sort_title = attributes["journal_issue_pending_sort_title"]
        touched = true
      end
      if unset_journal_volume?
        model.journal_issue.journal_volume = nil
        touched = true
      end
      model.journal_issue.save if touched
    end
    # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

    def unset_journal_volume?
      relationships.key?(:journal_volume) && relationships.dig(:journal_volume, :data, :_remove) == true
    end

    def adjusted_relationships
      clone = relationships.clone
      clone.delete(:journal_volume) if unset_journal_volume?
      clone
    end

    private

    def hashtag!(attributes)
      raw = attributes[:hashtag]
      return if raw.blank? || !raw.start_with?("#")

      raw[0] = ""
      attributes[:hashtag] = raw
    end
  end
end
