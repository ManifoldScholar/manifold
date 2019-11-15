class ApplicationSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  default_url_options[:host] = Rails.configuration.manifold.url

  meta(partial: false)

  class << self
    def introspect_abilities
      _attributes
    end
  end

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
  alias :current_user_is_creator? current_user_is_creator
end
