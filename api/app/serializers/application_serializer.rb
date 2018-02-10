class ApplicationSerializer < ActiveModel::Serializer
  meta(partial: false)

  def authenticated?
    current_user.present?
  end

  def current_user
    scope&.authenticated_as
  end
end
