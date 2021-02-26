class UserCollectionAuthorizer < ApplicationAuthorizer
  include AbstractCollectionAuthorizer

  # Defer to {UserAuthorizer}
  def default(adjective, user, options = {})
    resource.user.send(:"#{adjective}_by?", user, options)
  end

  class << self
    def default(_ability, user, options = {})
      target_user = options[:target]

      return user == target_user if target_user.present?

      super
    end
  end
end
