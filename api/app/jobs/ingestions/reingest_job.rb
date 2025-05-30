# frozen_string_literal: true

module Ingestions
  # @see Ingestion#perform_reingest!
  class ReingestJob < ApplicationJob
    # @param [Ingestion] ingestion
    # @param [User] user
    # @return [void]
    def perform(ingestion, user)
      ingestion.perform_reingest! user
    end
  end
end
