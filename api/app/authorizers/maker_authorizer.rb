# frozen_string_literal: true

class MakerAuthorizer < ApplicationAuthorizer
  def default(_able, user, _options = {})
    marketeer_permissions?(user) ||
      resource_belongs_to_updatable_project?(user, resource)
  end

  class << self
    def default(_able, user, _options = {})
      marketeer_permissions?(user) || project_creator_permissions?(user)
    end
  end
end
