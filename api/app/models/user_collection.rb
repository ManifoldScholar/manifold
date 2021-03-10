class UserCollection < ApplicationRecord
  include ComposedCollection

  self.primary_key = :id

  belongs_to :user, inverse_of: :user_collection
end
