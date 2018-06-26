require "rails_helper"

RSpec.describe Ingestions::Configuration::StrategyRegistry do
  class Ingestions::Strategies::TestStrategy < Ingestions::Strategies::AbstractStrategy; end

  the_subject_behaves_like "an ingestion registry", "strategy :test_strategy"
end
