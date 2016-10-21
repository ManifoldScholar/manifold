# Wraps updates to the current_user in the API controller
class CurrentUserUpdatePresenter
  include ActiveModel::Model

  attr_accessor :id, :type, :data

  def update(user)
    attributes, avatar, remove_avatar = extract_params
    user.assign_attributes(attributes)
    update_avatar(user, avatar) if avatar
    remove_avatar(user, remove_avatar) if remove_avatar
    user.save
  end

  def extract_params
    attributes = data[:attributes]
    avatar = attributes.extract!(:avatar)[:avatar]
    remove_avatar = attributes.extract!(:remove_avatar)[:remove_avatar]
    [attributes, avatar, remove_avatar]
  end

  def update_avatar(user, avatar)
    data, filename = avatar.values_at(:data, :content_type, :filename)
    avatar = Paperclip.io_adapters.for(data)
    avatar.original_filename = filename
    user.avatar = avatar
  end

  def remove_avatar(user, remove_avatar)
    user.avatar = nil if remove_avatar
  end
end
