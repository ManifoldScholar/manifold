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
      hashtag!(clone)
      clone
    end

    def post_update(model)
      @model = model
      model.journal_issue.number = attributes["journal_issue_number"] if attributes.key? "journal_issue_number"
      model.journal_issue.journal_volume = nil if unset_journal_volume?
      model.journal_issue.save
    end

    def unset_journal_volume?
      relationships.key?(:journal_volume) && relationships.dig(:journal_volume, :data, :id).nil?
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
