# frozen_string_literal: true

FactoryBot.define do
  factory :lti_deployment do
    lti_registration
    sequence(:deployment_id) { |n| "deployment_#{n}" }

    trait :disabled do
      enabled { false }
    end
  end
end
