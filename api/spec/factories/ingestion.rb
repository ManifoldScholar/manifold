FactoryBot.define do
  factory :ingestion do
    transient do
      source_path { nil }
    end

    state { "sleeping" }
    external_source_url { "http://example.com/index.md" }
    association :creator, factory: :user
    project
    text

    trait :file_source do
      external_source_url { nil }

      after(:build) do |ingestion, evaluator|

        ingestion.source =
          case evaluator.source_path
          when IO, File then evaluator.source_path
          when Pathname then evaluator.source_path.open
          when String then File.open(evaluator.source_path)
          else
            raise "Must provide `source_path:` for :file_source ingestions"
          end
      end
    end

    trait :uningested do
      text { nil }
    end
  end
end
