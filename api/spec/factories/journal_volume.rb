# frozen_string_literal: true

FactoryBot.define do
  factory :journal_volume do
    number { 1 }
    association :journal
    association :creator, factory: :user
  end
end
