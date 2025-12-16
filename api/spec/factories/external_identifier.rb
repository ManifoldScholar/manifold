# frozen_string_literal: true

FactoryBot.define do
  factory :external_identifier do
    identifiable factory: :project

    sequence(:identifier) { |n| "identifier-#{n}" }
  end
end
