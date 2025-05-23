# frozen_string_literal: true

FactoryBot.define do
  factory :resource_collection do
    title { "Some Collection" }
    project
  end
end
