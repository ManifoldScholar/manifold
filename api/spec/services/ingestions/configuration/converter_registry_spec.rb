require "rails_helper"

RSpec.describe Ingestions::Configuration::ConverterRegistry do
  class Ingestions::Converters::TestConverter < Ingestions::Converters::AbstractConverter; end

  the_subject_behaves_like "an ingestion registry", "converter :test_converter"

end
