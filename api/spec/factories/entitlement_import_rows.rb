# frozen_string_literal: true

FactoryBot.define do
  factory :entitlement_import_row do
    association :entitlement_import

    sequence(:line_number)
  end
end
