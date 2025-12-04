# frozen_string_literal: true

module Attachments
  # @see Attachments::RegenerateDerivativesJob
  class RegenerateAllDerivativesJob < ApplicationJob
    include JobIteration::Iteration

    queue_as :low_priority

    discard_on NameError

    # @param [String] model_name
    # @param [String] cursor
    # @return [void]
    def build_enumerator(model_name, cursor:)
      model_klass = model_name.constantize

      enumerator_builder.active_record_on_records(
        model_klass.all,
        cursor:
      )
    end

    # @param [ApplicationRecord] record
    # @param [String] model_name
    # @return [void]
    def each_iteration(record, model_name)
      model_klass = model_name.constantize

      model_klass.shrine_attachment_configurations.each_key do |attachment_name|
        attacher = record.public_send(:"#{attachment_name}_attacher")

        next unless attacher.stored?

        Attachments::RegenerateDerivativesJob.perform_later(record, attachment_name)
      end
    end
  end
end
