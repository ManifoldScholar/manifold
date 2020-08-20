class Permission < ApplicationRecord
  self.primary_key = :id

  include Authority::Abilities
  include SerializedAbilitiesFor

  belongs_to :user
  belongs_to :resource, polymorphic: true

  scope :by_resource, ->(resource) { where resource: resource }
  scope :by_user, ->(user) { where(user: user) }

  validates :user, :resource, presence: true
  validate :role_names_present!

  def readonly?
    true
  end

  def role_names_present!
    return true if role_names.present?

    message = if persisted?
                <<~HEREDOC
                  must have at least one specified. If you want to remove all permissions, delete this permission
                HEREDOC
              else
                "must have at least one specified"
              end
    errors.add :role_names, message
  end

  class << self
    # @return [Permission, nil]
    def fetch(resource, user)
      by_resource(resource).by_user(user).first
    end

    # @return [<String>]
    def fetch_roles_for(resource, user)
      Array(fetch(resource, user)&.role_names)
    end

    # @raise [ActiveRecord::RecordNotFound]
    # @return [Permission]
    def fetch!(resource, user)
      by_resource(resource).by_user(user).first!
    end
  end
end
