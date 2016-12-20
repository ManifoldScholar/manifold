module Updaters
  # Updates a User model from JSON-API style params
  class User
    include ::Updaters

    def adjusted_attributes
      return {} unless attributes
      clone = attributes.to_h
      update_avatar!(clone)
      remove_avatar!(clone)
      clone
    end

    def update_avatar!(attributes)
      return unless attributes[:avatar]
      avatar_params = attributes.extract!(:avatar)[:avatar]
      data, filename = avatar_params.values_at(:data, :content_type, :filename)
      avatar = Paperclip.io_adapters.for(data)
      avatar.original_filename = filename
      attributes[:avatar] = avatar
    end

    def remove_avatar!(attributes)
      remove_avatar = attributes.extract!(:remove_avatar)[:remove_avatar]
      attributes[:avatar] = nil if remove_avatar
    end
  end
end
