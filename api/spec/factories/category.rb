# frozen_string_literal: true

FactoryBot.define do
  factory :category do
    title { "Some category" }
    role { Category::ROLE_TEXT }
    project
  end
end
