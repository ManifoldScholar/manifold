module API
  module V1
    module ReadingGroups
      module Relationships
        # @abstract
        class AbstractController < ApplicationController
          include ActiveSupport::Concern

          before_action :load_reading_group!

          authorize_actions_for :reading_group, all_actions: :read

          private

          # @raise [ActiveRecord::RecordNotFound]
          def load_reading_group!
            @reading_group = ReadingGroup.find params[:reading_group_id]
          end

          class << self
            # @see API::V1::ReadingGroups::Relationships::Collectable.define_resourceful_scope_for!
            # @param [Class] klass
            # @return [void]
            def for_collectable!(klass)
              include API::V1::ReadingGroups::Relationships::Collectable

              define_resourceful_scope_for! klass
            end
          end
        end
      end
    end
  end
end
