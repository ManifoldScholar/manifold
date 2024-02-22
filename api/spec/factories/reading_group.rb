# frozen_string_literal: true

FactoryBot.define do
  factory :reading_group do
    transient do
      with_user { nil }
    end

    name { "A Reading Group" }
    association :creator, factory: :user

    after :create do |reading_group, evaluator|
      Array(evaluator.with_user).each do |user|
        create :reading_group_membership, reading_group: reading_group, user: user
      end
    end

    trait :is_private do
      privacy { "private" }
    end

    trait :is_public do
      privacy { "public" }
    end
  end
end
