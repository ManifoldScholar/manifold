# frozen_string_literal: true

FactoryBot.define do
  factory :tag do
    name { Faker::Creature::Dog.breed }
  end
end
