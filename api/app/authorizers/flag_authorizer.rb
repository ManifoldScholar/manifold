# frozen_string_literal: true

class FlagAuthorizer < ApplicationAuthorizer
  def creatable_by?(user, _options = {})
    known_user?(user)
  end

  def deletable_by?(user, _options = {})
    creator_or_has_editor_permissions?(user, resource)
  end

  class << self
    def default(_able, _user, _options = {})
      false
    end

    def creatable_by?(user, _options = {})
      authenticated? user
    end

    def deletable_by?(user, _options = {})
      authenticated? user
    end
  end
end
