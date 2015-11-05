require "rails_helper"

RSpec.describe Ingestor::Strategy do
  before :all do
    class ValidSampleStrategy < Ingestor::Strategy::Base
      def self.can_ingest?; end

      def self.ingest; end
    end
  end

  it "should respond to :add" do
    expect(Ingestor::Strategy.respond_to?(:add)).to be true
  end

  it "should allow access to a specific strategy" do
    Ingestor::Strategy.add(:valid_strategy, ValidSampleStrategy)
    strategy = Ingestor::Strategy[:valid_strategy]
    expect(strategy).to_not be_nil
    expect(strategy).to be ValidSampleStrategy
  end

  it "should allow the addition of a strategy" do
    Ingestor::Strategy.add(:sample_strategy, ValidSampleStrategy)
    expect(Ingestor::Strategy[:sample_strategy]).to eq ValidSampleStrategy
  end

  it "should raise an error if I add a strategy that does not extend Ingestor::Strategy::Base" do
    invalid_strategy = Class.new do
      def self.ingest; end

      def self.can_ingest?; end
    end
    expect do
      Ingestor::Strategy.add(:invalid_strategy, invalid_strategy)
    end.to raise_error(/is not a Ingestor::Strategy::Base/)
  end

  it "should not allow a strategy that does not have an ingest method" do
    invalid_strategy = Class.new do
      def can_ingest?; end
    end
    expect do
      Ingestor::Strategy.add(:invalid_strategy, invalid_strategy)
    end.to raise_error
  end

  it "should not allow a strategy that does not have a can_ingest? method" do
    invalid_strategy = Class.new do
      def ingest; end
    end
    expect do
      Ingestor::Strategy.add(:invalid_strategy, invalid_strategy)
    end.to raise_error
  end

  it "should allow me to clear the strategies" do
    Ingestor::Strategy.add(:valid_strategy, ValidSampleStrategy)
    expect(Ingestor::Strategy[:valid_strategy]).to_not be_nil
    Ingestor::Strategy.clear!
    expect(Ingestor::Strategy[:valid_strategy]).to be_nil
  end
end
