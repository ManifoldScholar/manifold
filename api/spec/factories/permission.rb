# frozen_string_literal: true

FactoryBot.define do
  factory :permission do
    role_names { ["project_editor"] }
    user
    association :resource, factory: :project
  end
end
