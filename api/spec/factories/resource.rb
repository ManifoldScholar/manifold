RESOURCE_SAMPLES ||= Rails.root.join("spec", "data", "resource_import")

FactoryBot.define do
  factory :resource do
    title { "Rowan" }
    external_url { Faker::Internet.url }
    tag_list { "dog,puppy" }
    association :creator, factory: :user
    project

    trait :archive do
      attachment { RESOURCE_SAMPLES.join("sample.zip").open }
    end

    trait :audio do
      attachment { RESOURCE_SAMPLES.join("sample.mp3").open }
    end

    trait :csv do
      attachment { RESOURCE_SAMPLES.join("sample.csv").open }
    end

    trait :image do
      attachment { RESOURCE_SAMPLES.join("sample.png").open }
    end

    trait :pdf do
      attachment { RESOURCE_SAMPLES.join("sample.pdf").open }
    end

    trait :presentation do
      attachment { RESOURCE_SAMPLES.join("sample.pptx").open }
    end

    trait :spreadsheet do
      attachment { RESOURCE_SAMPLES.join("sample.xlsx").open }
    end

    trait :text_document do
      attachment { RESOURCE_SAMPLES.join("sample.rtf").open }
    end

    trait :video do
      attachment { RESOURCE_SAMPLES.join("sample.mp4").open }
    end

    trait :with_transcript do
      transcript { RESOURCE_SAMPLES.join("sample.rtf").open }
    end

    trait :with_translation do
      translation { RESOURCE_SAMPLES.join("sample.rtf").open }
    end
  end
end
