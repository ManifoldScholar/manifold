FactoryBot.define do
  factory :reading_group do
    name { "A Reading Group" }
    memberships_count { 0 }
    annotations_count { 0 }
    association :creator, factory: :user
  end
end
