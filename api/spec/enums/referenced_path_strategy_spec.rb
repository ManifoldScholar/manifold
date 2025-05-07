# frozen_string_literal: true

require "rails_helper"

RSpec::Matchers.define :use_referenced_path_strategy do |name|
  match do |path|
    @metadata ||= {}.with_indifferent_access

    ReferencedPathStrategy.find_for path do |m|
      m.success do |enum, metadata|
        enum == name && metadata == @metadata
      end

      m.failure do |enum, metadata|
        enum == name && metadata == @metadata
      end
    end
  end

  chain :with_metadata do |metadata|
    @metadata = Hash(metadata).with_indifferent_access
  end
end

RSpec.describe ReferencedPathStrategy, packaging: true, type: :enum do
  subject { described_class.new }

  describe ReferencedPathStrategy::External do
    it { is_expected.to be_known }
  end

  describe ReferencedPathStrategy::IngestionSource do
    it { is_expected.to be_known }
  end

  describe ReferencedPathStrategy::TextSectionLink do
    it { is_expected.to be_known }
  end

  describe ReferencedPathStrategy::Unknown do
    it { is_expected.not_to be_known }
  end
end
