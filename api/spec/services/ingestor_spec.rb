require "rails_helper"

RSpec.describe Ingestor do

  it "should allow assignment of a logger object" do
    logger = Logger.new(STDOUT)
    Ingestor.logger = logger
    expect(Ingestor.logger).to be logger
  end

  it "should reset the logger back to Rails.logger" do
    logger = Logger.new(STDOUT)
    Ingestor.logger = logger
    expect(Ingestor.logger).to be logger
    Ingestor.reset_logger
    expect(Ingestor.logger).to be Rails.logger
  end

  it "should catch and report an ingestion failure" do
    path = "/tmp/book.nevermind"
    expect(Ingestor::logger).to receive(:error)
    Ingestor::ingest(path)
  end

end
