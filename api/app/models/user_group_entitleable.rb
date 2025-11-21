# frozen_string_literal: true

class UserGroupEntitleable < ApplicationRecord
  belongs_to :user_group, inverse_of: :entitleables
  belongs_to :entitleable, polymorphic: true
end
