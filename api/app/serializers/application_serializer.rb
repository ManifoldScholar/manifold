class ApplicationSerializer < ActiveModel::Serializer
  def authenticated?
    current_user.present?
  end

  def current_user
    scope&.authenticated_as
  end
end
