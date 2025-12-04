# frozen_string_literal: true

module SystemUpgrades
  module Upgrades
    class Manifold090001 < SystemUpgrades::AbstractVersion
      MODEL_KLASSES = %w[
        ActionCallout
        Feature
        IngestionSource
        Journal
        Maker
        Project
        ProjectCollection
        Resource
        ResourceCollection
        Settings
        Text
        TextSection
        User
      ].freeze

      QUERY_CONDITION = <<~SQL
      %<data_name>s @> '{"storage":"store"}' AND %<data_name>s #>> '{derivatives,medium}' IS NOT NULL AND %<data_name>s #>> '{derivatives,large}' IS NULL
      SQL

      def perform!
        regenerate_new_derivatives!
      end

      private

      def regenerate_new_derivatives!
        logger.info("===================================================================")
        logger.info("Regenerate New Derivatives")
        logger.info("===================================================================")
        logger.info("We've added a new derivative to images, which must be regenerated in the background")
        logger.info("===================================================================")

        MODEL_KLASSES.each do |model_name|
          model_klass = "::#{model_name}".constantize
        rescue NameError
          logger.warn("Model #{model_name} no longer exists, skipping")
        else
          regenerate_derivatives_for!(model_klass)
        end
      end

      # @param [Class<ApplicationRecord>] model_klass
      # @return [void]
      def regenerate_derivatives_for!(model_klass)
        model_klass.shrine_attachment_configurations.each_key do |attachment_name|
          data_name = "#{attachment_name}_data"

          next unless model_klass.column_names.include?(data_name)

          condition = QUERY_CONDITION % { data_name:, }

          model_klass.where(condition).find_each do |record|
            Attachments::RegenerateDerivativesJob.perform_later(record, attachment_name)
          end
        end
      end
    end
  end
end
