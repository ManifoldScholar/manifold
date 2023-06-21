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
  describe ".find_for" do
    class << self
      def finds_strategy_given(path, strategy, **provided_metadata)
        context "with #{path.inspect} as input" do
          subject { path }

          it { is_expected.to use_referenced_path_strategy(strategy).with_metadata(provided_metadata) }
        end
      end
    end

    finds_strategy_given "https://example.com/foo/bar/baz", :external
    finds_strategy_given "/api/proxy/ingestion_sources/fb4477ee-b896-4159-b54d-bbffb71ba5da",
      :ingestion_source,
      ingestion_source_id: "fb4477ee-b896-4159-b54d-bbffb71ba5da"
    finds_strategy_given "/read/9f5bbb79-4032-4bad-8ac0-ef25daeb1395/section/b161763e-bece-49c7-9040-638349336625",
      :text_section_link,
      text_id: "9f5bbb79-4032-4bad-8ac0-ef25daeb1395", text_section_id: "b161763e-bece-49c7-9040-638349336625"
    finds_strategy_given "/anything/else", :unknown
  end

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
