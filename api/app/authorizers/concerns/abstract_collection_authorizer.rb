module AbstractCollectionAuthorizer
  extend ActiveSupport::Concern

  module ClassMethods
    # At the class level, all actions are considered available as long as a user is signed in.
    def default(_able, user, _options = {})
      user.present?
    end
  end
end
