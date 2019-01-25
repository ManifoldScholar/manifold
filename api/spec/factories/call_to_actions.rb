FactoryBot.define do
  factory :call_to_action do
    title { "Check this out" }
    url { Faker::Internet.url }
    kind { :link }
    location { :content }
    project
  end

  factory :start_reading_cta, parent: :call_to_action do
    kind { :start_reading }
    text
  end

  factory :table_of_contents_cta, parent: :call_to_action do
    kind { :table_of_contents }
    text
  end

  factory :download_cta, parent: :call_to_action do
    kind { :download }
  end

  factory :link_cta, parent: :call_to_action do
    kind { :link }
  end

  factory :button_cta, parent: :call_to_action do
    kind { :button }
  end
end
