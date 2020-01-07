require 'rails_helper'

RSpec.describe ExportTarget, type: :model do
  let(:strategy) { :unknown }
  let(:name) { "Some Strategy" }
  let(:traits) { [strategy] }
  let(:instance) { FactoryBot.create :export_target, *traits, name: name }

  subject { instance }

  class << self
    def with_strategy(value, &block)
      context "with strategy: #{value.inspect}" do |*args|
        let(:strategy) { value }

        its(:configuration) { is_expected.to be_using_strategy value }

        ExportTargetStrategy.each do |enum|
          next unless enum != value

          its(:configuration) { is_expected.not_to be_using_strategy enum.to_sym }
        end

        instance_exec(*args, &block)
      end
    end
  end

  with_strategy :s3 do
    its("configuration.configured_strategy") { will raise_error(ExportStrategies::DisabledStrategy) }
  end

  with_strategy :sftp_key do
    its(:configuration) { is_expected.to be_using_sftp_key }
    its("configuration.configured_strategy") { is_expected.to be_a_kind_of ExportStrategies::SFTPKeyStrategy }
  end

  with_strategy :sftp_password do
    its(:configuration) { is_expected.to be_using_sftp_password }
    its("configuration.configured_strategy") { is_expected.to be_a_kind_of ExportStrategies::SFTPPasswordStrategy }
  end

  with_strategy :unknown do
    its("configuration.configured_strategy") { will raise_error(ExportStrategies::DisabledStrategy) }
  end
end
