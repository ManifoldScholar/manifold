module Updaters
  # Updates a Journal model from JSON-API style params
  class Journal

    include ::Updaters
    include ::Updaters::Concerns::HasSortableCollaborators

    def attachment_fields
      [:avatar, :hero, :logo, :custom_icon, :social_image]
    end

    def adjusted_attributes
      return {} unless attributes

      clone = attributes.clone
      hashtag!(clone)
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
