class ApplicationSerializer < ActiveModel::Serializer
  meta(partial: false)

  def abilities
    object.serialized_abilities_for(current_user)
  end

  def authenticated?
    current_user.present?
  end

  def current_user
    scope&.authenticated_as
  end
end
