# frozen_string_literal: true

FactoryBot.define do
  factory :collaborator do
    role { CollaboratorRole::Author }
    association :collaboratable, factory: :project
    maker
  end
end
