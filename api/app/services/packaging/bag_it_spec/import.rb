# frozen_string_literal: true

module Packaging
  module BagItSpec
    # Module that can be used to inject dependencies from {Packaging::BagItSpec::Container}
    Import = Dry::AutoInject(Packaging::BagItSpec::Container)
  end
end
