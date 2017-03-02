FactoryGirl.define do
  factory :resource do
    title "Rowan"
    external_url "http://www.dailyrowan.com"
    keywords "dog, puppy"
    association :creator, factory: :user
    project
  end
end
