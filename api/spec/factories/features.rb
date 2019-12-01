FactoryBot.define do
  factory :feature do
    header { "MyString" }
    body { "MyString" }
    link_text { "MyString" }
    link_url { "MyString" }
    link_target { "MyString" }
    background { "" }
    foreground { "" }
    position { 1 }
    association :creator, factory: :user
  end
end
