# frozen_string_literal: true

FactoryBot.define do
  factory :pending_entitlement do
    association :subject, factory: :project

    expiration { "in 1 year" }
    email { Faker::Internet.unique.safe_email }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
  end
end
