# frozen_string_literal: true

FactoryBot.define do
  factory :setting, class: 'Settings' do
    singleton_guard { 0 }
  end
end
