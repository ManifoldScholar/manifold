FactoryBot.define do
  factory :ingestion_source do
    transient do
      attachment_path { Rails.root.join("spec/data/assets/images/publication_resource.png") }
      default_source_identifier { ('a'..'z').to_a.shuffle[0,8].join }
    end

    kind { IngestionSourceKind[:section] }
    source_identifier { default_source_identifier }
    text

    after(:build) do |ingestion_source, evaluator|
      evaluator.attachment_path.then do |attachment|
        break nil unless attachment.present?

        path = Pathname.new attachment

        ingestion_source.attachment_attacher.assign path.open
      end
    end

    trait :publication_resource do
      kind { IngestionSourceKind[:publication_resource] }
    end

    trait :image do
      publication_resource

      attachment_path { Rails.root.join("spec/data/assets/images/publication_resource.png") }
      source_identifier { attachment_path.then { |v| File.basename(v) rescue default_source_identifier } }
    end
  end
end
