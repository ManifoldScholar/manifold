# frozen_string_literal: true

# Conventions-based approach for triggering a new {Ingestion} for a specific parent model.
#
# @see Project
# @see Text
module API
  module V1
    module CreatesIngestionsFromParent
      extend ActiveSupport::Concern

      included do
        before_action :load_ingestion_parent!, only: %i[create]

        resourceful! Ingestion do
          ingestion_parent.ingestions
        end

        delegate :ingestion_parent_klass, to: :class
      end

      # @return [ApplicationRecord]
      attr_reader :ingestion_parent

      # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
      def create
        @ingestion = ::Updaters::Ingestion
          .new(ingestion_params)
          .update_without_save(ingestion_parent.ingestions.new)

        @ingestion.creator = current_user

        case ingestion_parent
        when Project
          @ingestion.project_id = ingestion_parent.id
          @ingestion.target_kind = "text"
        when Text
          @ingestion.project_id = ingestion_parent.project_id
          @ingestion.target_kind = "text_section"
          @ingestion.text_section_id = params[:data][:relationships][:text_section]
        else
          # :nocov:
          raise "Invalid ingestion parent: #{ingestion_parent.inspect}"
          # :nocov:
        end

        @ingestion.process(current_user) if @ingestion.save

        render_single_resource @ingestion, serializer: ::V1::IngestionSerializer
      end
      # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

      # @api private
      # @raise [ActiveRecord::RecordNotFound]
      # @return [void]
      def load_ingestion_parent!
        id_key = "#{ingestion_parent_klass.model_name.param_key}_id"

        @ingestion_parent = ingestion_parent_klass.friendly.find(params[id_key])
      end

      module ClassMethods
        # @return [Class<ApplicationRecord>]
        attr_reader :ingestion_parent_klass

        # @param [Class<ApplicationRecord>]
        # @return [void]
        def creates_ingestions_for!(ingestion_parent_klass)
          @ingestion_parent_klass = ingestion_parent_klass
        end
      end
    end
  end
end
