module APIDocs
  module Definitions
    module Resources
      class ProjectCollection

        REQUIRED_CREATE_ATTRIBUTES = [
          :title,
          :sort_order,
          :icon
        ].freeze

        class << self
          include APIDocs::Definitions::Resource
        end
      end
    end
  end
end
