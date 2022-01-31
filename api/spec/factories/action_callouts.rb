FactoryBot.define do
  factory :action_callout do
    title { "Check this out" }
    url { Faker::Internet.url }
    kind { :link }
    location { :left }
    association :calloutable, factory: :project
  end

  factory :read_action_callout, parent: :action_callout do
    kind { :read}
    text
  end

  factory :toc_action_callout, parent: :action_callout do
    kind { :toc }
    text
  end

  factory :download_action_callout, parent: :action_callout do
    kind { :download }
  end

  factory :link_action_callout, parent: :action_callout do
    kind { :link }
  end

  factory :button_action_callout, parent: :action_callout do
    kind { :button }
  end
end
