class ReadingGroupKindAuthorizer < ApplicationAuthorizer
  def default(user, *)
    admin_permissions?(user)
  end

  def readable_by?(*)
    true
  end

  class << self
    def default(_adjective, user, *)
      admin_permissions?(user)
    end

    def readable_by?(*)
      true
    end
  end
end
