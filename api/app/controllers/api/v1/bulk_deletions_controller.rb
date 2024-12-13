# frozen_string_literal: true

module API
  module V1
    # @see BulkDeletions::HandleRequest
    # @see BulkDeletions::RequestHandler
    class BulkDeletionsController < ApplicationController
      include MonadicControllerActions

      authority_actions annotations: "bulk_delete", reading_groups: "bulk_delete", users: "bulk_delete"

      def annotations
        bulk_delete! ::Annotation
      end

      def reading_groups
        bulk_delete! ::ReadingGroup
      end

      def users
        bulk_delete! ::User
      end

      private

      # @param [Class<ApplicationRecord>] model_klass
      # @return [void]
      def bulk_delete!(model_klass)
        authorize_action_for model_klass

        options = {
          model_klass: model_klass,
          user: current_user,
        }

        raw_params = params.to_unsafe_h

        options[:filters] = raw_params.dig(:bulk_delete, :filters)
        options[:raw_ids] = Array(raw_params.dig(:bulk_delete, :ids)).compact_blank

        handle_monadic_operation! "bulk_deletions.handle_request", options do |m|
          m.success do |bulk_deletions|
            render json: { bulk_deletions: bulk_deletions }
          end
        end
      end
    end
  end
end
