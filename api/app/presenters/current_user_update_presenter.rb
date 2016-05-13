# Wraps updates to the current_user in the API controller
class CurrentUserUpdatePresenter
  include ActiveModel::Model

  attr_accessor :nickname, :avatar, :remove_avatar

  def update(user)
    user.nickname = nickname
    if avatar
      data, filename = avatar.values_at(:data, :content_type, :filename)
      avatar = Paperclip.io_adapters.for(data)
      avatar.original_filename = filename
      user.avatar = avatar
    end
    user.avatar = nil if remove_avatar
    user.save
  end
end
