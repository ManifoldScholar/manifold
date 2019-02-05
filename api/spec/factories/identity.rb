FactoryBot.define do
  factory :identity do
    user

    provider { ManifoldEnv.known_strategies.sample }

    uid { SecureRandom.uuid }

    trait :facebook do
      provider { 'facebook' }
    end

    trait :google do
      provider { 'google_oauth2' }
    end

    trait :twitter do
      provider { 'twitter' }
    end
  end
end
