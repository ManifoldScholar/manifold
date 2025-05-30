# frozen_string_literal: true

FactoryBot.define do
  factory :ingestion_message do
    association(:ingestion)

    kind { "log" }

    trait :info do
      payload { ['INFO', 'an info message'] }
    end

    trait :warn do
      payload { ['WARNING', 'a warning message'] }
    end

    trait :error do
      payload { ['ERROR', 'an error message'] }
    end

    trait :fatal do
      payload { ['FATAL', 'a fatal message'] }
    end

    trait :unknown do
      payload { ['UNKNOWN', 'an unknown message'] }
    end
  end
end
