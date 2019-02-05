FactoryBot.define do
  factory :comment do
    body { "This is the body" }
    association :creator, factory: :user
    association :subject, factory: :annotation
  end
end
