FactoryBot.define do
  factory :resource do
    title "Rowan"
    external_url { Faker::Internet.url }
    tag_list "dog,puppy"
    association :creator, factory: :user
    project
  end
end
