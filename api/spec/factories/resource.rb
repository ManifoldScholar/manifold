FactoryGirl.define do
  factory :resource do
    title "Rowan"
    external_url "http://www.dailyrowan.com"
    tag_list "dog,puppy"
    association :creator, factory: :user
    project
  end
end
