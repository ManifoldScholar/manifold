# frozen_string_literal: true

# This class takes an Ingestion record and
# returns a new Text record.
module Ingestions
  class Ingestor < AbstractContextualIngestor
    private

    def run_ingestion
      strategy = compose Ingestions::Pickers::Strategy

      compose_into :manifest, strategy.interaction
      compose_into :manifest, Ingestions::PreProcessor

      ActiveRecord::Base.transaction do
        compose_into :text, Ingestions::Compiler

        compose Ingestions::PostProcessor

        set_ingestion_text
      end

      text
    end

    def text
      shared_inputs[:text]
    end

    def set_ingestion_text
      return unless text.present?

      ingestion.update text: text
    end
  end
end
