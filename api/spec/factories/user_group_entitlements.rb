# frozen_string_literal: true

FactoryBot.define do
  factory :user_group_entitleable do
    user_group
    entitleable { FactoryBot.create(:project) }
  end
end
