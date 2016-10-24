FactoryGirl.define do
  factory :text_section do
    sequence(:position)
    kind TextSection::KIND_SECTION
    text
    ingestion_source
  end
end
