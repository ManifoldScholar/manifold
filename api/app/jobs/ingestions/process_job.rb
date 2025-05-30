# frozen_string_literal: true

module Ingestions
  # @see Ingestion#perform_process!
  class ProcessJob < ApplicationJob
    # @param [Ingestion] ingestion
    # @param [User] user
    # @return [void]
    def perform(ingestion, user)
      ingestion.perform_process! user
    end
  end
end
