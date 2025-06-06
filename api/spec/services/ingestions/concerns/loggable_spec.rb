# frozen_string_literal: true

require "rails_helper"

class LoggingThing
  include Ingestions::Concerns::Loggable
  def initialize(logger)
    @logger = logger
  end
end

RSpec.describe Ingestions::Concerns::Loggable do
  let(:logging_thing) { LoggingThing.new(Rails.logger) }

  it "logs info level messages" do
    expect(Rails.logger).to receive(:info)
    logging_thing.info("test")
  end

  it "logs debug level messages" do
    expect(Rails.logger).to receive(:debug)
    logging_thing.debug("test")
  end

  it "logs error level messages" do
    expect(Rails.logger).to receive(:error)
    logging_thing.error("test")
  end

  it "logs warn level messages" do
    expect(Rails.logger).to receive(:warn)
    logging_thing.warn("test")
  end
end
