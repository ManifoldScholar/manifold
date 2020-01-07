FactoryBot.define do
  factory :export_target do
    strategy { :unknown }
    sequence(:name) { |i| "Target %04d" % i }

    association :configuration, :using_unknown_strategy, factory: :export_strategies_configuration, strategy: :build

    trait :s3 do
      strategy { :s3 }

      association :configuration, :using_s3_strategy, factory: :export_strategies_configuration, strategy: :build
    end

    trait :sftp_key do
      strategy { :sftp_key }

      association :configuration, :using_sftp_key_strategy, factory: :export_strategies_configuration, strategy: :build
    end

    trait :sftp_password do
      strategy { :sftp_password }

      association :configuration, :using_sftp_password_strategy, factory: :export_strategies_configuration, strategy: :build
    end

    trait :unknown do
      strategy { :unknown }

      association :configuration, :using_unknown_strategy, factory: :export_strategies_configuration, strategy: :build
    end
  end
end
