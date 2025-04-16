# frozen_string_literal: true

FactoryBot.define do
  factory :entitler do
    association :entity, factory: :user
  end
end
