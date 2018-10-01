class ApplicationSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  default_url_options[:host] = ENV["DOMAIN"]
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

  def current_user_is_creator
    return false unless current_user
    return false unless object.respond_to? :creator
    object.creator == current_user
  end
end
