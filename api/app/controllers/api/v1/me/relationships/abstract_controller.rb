module API
  module V1
    module Me
      module Relationships
        # @abstract
        class AbstractController < ApplicationController
          before_action :authenticate_request!

          class << self
            # @see API::V1::Me::Relationships::Collectable.define_resourceful_scope_for!
            # @param [Class] klass
            # @return [void]
            def for_collectable!(klass)
              include API::V1::Me::Relationships::Collectable

              define_resourceful_scope_for! klass
            end
          end
        end
      end
    end
  end
end
