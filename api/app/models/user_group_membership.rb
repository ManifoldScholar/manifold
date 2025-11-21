# frozen_string_literal: true

class UserGroupMembership < ApplicationRecord
  include ProvidesEntitlements

  belongs_to :user, inverse_of: :user_group_memberships
  belongs_to :user_group, inverse_of: :memberships

  belongs_to :source, polymorphic: true, optional: true

  def name
    "#{user_group.name} membership for #{user.name}"
  end

end
