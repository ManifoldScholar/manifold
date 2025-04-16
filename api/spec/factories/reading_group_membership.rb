# frozen_string_literal: true

FactoryBot.define do
  factory :reading_group_membership do
    reading_group
    user

    trait :member do
      role { :member }
    end

    trait :moderator do
      role { :moderator }
    end
  end
end
