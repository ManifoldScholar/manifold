FactoryBot.define do
  factory :export_strategies_abstract_strategy, class: "ExportStrategies::AbstractStrategy" do
    factory :export_strategies_abstract_ssh_strategy, class: "ExportStrategies::AbstractSSHStrategy" do
      host { "sftp.example.com" }
      port { 22 }
      username { "test_user" }

      factory :export_strategies_sftp_key_strategy, class: "ExportStrategies::SFTPKeyStrategy" do
        private_key { "RSA 1234567" }
      end

      factory :export_strategies_sftp_password_strategy, class: "ExportStrategies::SFTPPasswordStrategy" do
        password { "123456789" }
      end
    end

    initialize_with { new(attributes) }
  end

  factory :export_strategies_configuration, class: "ExportStrategies::Configuration" do
    target_name_format { "%s.%n" }

    trait :using_s3_strategy do
      strategy { :s3 }
    end

    trait :using_sftp_key_strategy do
      strategy { :sftp_key }

      association :sftp_key, factory: :export_strategies_sftp_key_strategy, strategy: :build
    end

    trait :using_sftp_password_strategy do
      strategy { :sftp_password }

      association :sftp_password, factory: :export_strategies_sftp_password_strategy, strategy: :build
    end

    trait :using_unknown_strategy do
      strategy { :unknown }
    end

    initialize_with { new(attributes) }
  end
end
