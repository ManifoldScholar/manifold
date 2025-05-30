# frozen_string_literal: true

module APIDocs
  module Definitions
    module Resources
      class Tag
        ID_TYPE = ::Types::String.meta(example: "0")

        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
