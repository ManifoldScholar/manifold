# frozen_string_literal: true

FactoryBot.define do
  factory :cached_external_source_link do
    cached_external_source { nil }
    text { nil }
  end
end
