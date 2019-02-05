FactoryBot.define do
  factory :page do
    title { "MyString" }
    nav_title { "MyString" }
    show_in_footer { false }
    show_in_header { false }
    slug { "MyString" }
    hidden { false }
    body { "MyText" }
    is_external_link { false }
    external_link { "http://cnn.com" }
    open_in_new_tab { false }
    association :creator, factory: :user
  end
end
