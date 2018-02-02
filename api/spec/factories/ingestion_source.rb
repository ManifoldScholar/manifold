FactoryBot.define do
  factory :ingestion_source do
    kind TextSection::KIND_SECTION
    source_identifier ('a'..'z').to_a.shuffle[0,8].join
    text
  end
end
