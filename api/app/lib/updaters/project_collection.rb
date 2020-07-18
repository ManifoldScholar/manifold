module Updaters
  # Updates a ProjectCollection model from JSON-API style params
  class ProjectCollection

    include ::Updaters

    def attachment_fields
      [:hero, :custom_icon, :social_image]
    end

  end
end
