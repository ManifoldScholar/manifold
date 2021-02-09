FactoryBot.define do
  factory :reading_group_membership do
    reading_group
    user

    trait :moderator do
      role { :moderator }
    end
  end
end
