# frozen_string_literal: true

FactoryBot.define do
  factory :flag do
    association :creator, factory: :user
    association :flaggable, factory: :comment

    trait :resolved do
      resolved_at { Time.current }
    end

    trait :self_resolved do
      resolved

      resolved_by_creator { true }
    end
  end
end
