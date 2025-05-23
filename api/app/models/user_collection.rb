# frozen_string_literal: true

class UserCollection < ApplicationRecord
  include ComposedCollection

  self.primary_key = :id

  belongs_to_readonly :user, inverse_of: :user_collection
end
