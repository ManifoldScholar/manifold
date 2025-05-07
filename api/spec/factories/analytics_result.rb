# frozen_string_literal: true

FactoryBot.define do
  factory :analytics_result, class: 'Analytics::Reports::AnalyticsResult' do
    reports do
      []
    end
  end
end
