FactoryBot.define do
  factory :user do
    first_name { "John" }
    last_name { "Rambo" }
    sequence(:email) { |n| "john#{SecureRandom.uuid}-@rambo.com" }
    password { "bananarambo" }
    password_confirmation { "bananarambo" }
    notification_preferences_by_kind { Hash.new({
      digest: NotificationFrequency[:daily],
      followed_projects: NotificationFrequency[:always]
    }) }

    trait :admin do
      role { :admin }
    end

    trait :editor do
      role { :editor }
    end

    trait :project_creator do
      role { :project_creator }
    end

    trait :marketeer do
      role { :marketeer }
    end

    trait :reader do
      role { :reader }
    end
  end
end
