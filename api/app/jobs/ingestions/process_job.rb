# frozen_string_literal: true

module Ingestions
  # @see Ingestion#perform_process!
  class ProcessJob < ApplicationJob
    # @param [Ingestion] ingestion
    # @param [User] user
    # @return [void]
    def perform(ingestion, user)
      ingestion.ingestion_messages.create!(kind: "message", payload: "START_ACTION")
      ingestion.perform_process! user
      ingestion.ingestion_messages.create!(kind: "message", payload: "END_ACTION")
    end
  end
end
