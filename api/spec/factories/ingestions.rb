FactoryBot.define do
  factory :ingestion do
    state "sleeping"
    external_source_url "http://www.dailyrowan.com"
    association :creator, factory: :user
    project
    text
  end
end
