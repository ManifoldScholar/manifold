module Updaters
  # Updates a Resource model from JSON-API style params
  class Resource
    include ::Updaters

    def attachment_fields
      [
        :attachment, :high_res, :variant_thumbnail, :variant_format_one,
        :variant_format_two, :variant_poster
      ]
    end

  end
end
