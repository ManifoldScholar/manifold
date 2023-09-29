# frozen_string_literal: true

FactoryBot.define do
  factory :entitlement_import_row do
    association :entitlement_import

    sequence(:line_number)

    expiration { "in 1 year" }

    email { Faker::Internet.unique.email }

    first_name { Faker::Name.first_name }

    last_name { Faker::Name.last_name }
  end
end
