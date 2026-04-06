# frozen_string_literal: true

FactoryBot.define do
  factory :twitter_query do
    query { "puppies" }
    association :creator, factory: :user
    project
  end
end
