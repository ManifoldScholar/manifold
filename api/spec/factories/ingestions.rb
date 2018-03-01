FactoryBot.define do
  factory :ingestion do
    state "analyzed"
    ingestion_type "epub"
    external_source_url "http://www.dailyrowan.com"
    association :creator, factory: :user
    project
    text
  end
end
