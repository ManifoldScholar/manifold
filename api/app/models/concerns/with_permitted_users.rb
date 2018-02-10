module WithPermittedUsers
  extend ActiveSupport::Concern

  included do
    has_many :permitted_users, lambda {
      joins(:roles)
        .where(roles: { name: %w[author owner] })
        .distinct
    }, through: :roles,
       foreign_key: :resource_id,
       source: :users
  end
end
