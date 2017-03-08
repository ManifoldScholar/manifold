FactoryGirl.define do
  factory :resource do
    title "Rowan"
    external_type "youtube"
    keywords "dog, puppy"
    association :creator, factory: :user
    project
  end
end
