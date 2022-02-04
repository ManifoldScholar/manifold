FactoryBot.define do
  factory :journal_volume do
    number { 1 }
    association :journal, factory: :journal
    association :creator, factory: :user
  end
end
