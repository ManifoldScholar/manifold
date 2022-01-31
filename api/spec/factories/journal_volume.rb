FactoryBot.define do
  factory :journal_volume do
    number { 1 }
    subtitle { "Foo bar" }
    association :journal, factory: :journal
    association :creator, factory: :user
  end
end
