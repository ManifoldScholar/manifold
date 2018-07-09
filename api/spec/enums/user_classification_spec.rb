require 'rails_helper'

RSpec.describe UserClassification do
  let(:option) { described_class.instance_variable_get(:@option) }
  let(:enum) { UserClassification[option] }

  subject { enum }

  describe UserClassification::Default do
    it { is_expected.not_to be_unique }
  end

  describe UserClassification::Anonymous do
    it { is_expected.to be_unique }
  end

  describe UserClassification::CommandLine do
    it { is_expected.to be_unique }
  end
end
