# frozen_string_literal: true

module APIDocs
  module Definitions
    module Resources
      class ExportTarget
        REQUIRED_CREATE_ATTRIBUTES = [:name].freeze

        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
