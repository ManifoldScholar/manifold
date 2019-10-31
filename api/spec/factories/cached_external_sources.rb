FactoryBot.define do
  factory :cached_external_source do
    transient do
      sequence(:placeholder_text) { |i| "external-%05d" % i }
    end

    url { Faker::Internet.url }

    content_type { "application/octet-stream" }

    trait :png_image do
      content_type { "image/png" }
      url { Faker::Placeholdit.image text: placeholder_text, format: "png" }
    end

    trait :stylesheet do
      content_type { "text/css" }

      url { "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" }
    end
  end
end
