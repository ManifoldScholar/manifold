FactoryGirl.define do
  factory :resource do
    title "Rowan"
    kind "image"
    keywords "dog, puppy"
    association :creator, factory: :user
    project
  end
end
