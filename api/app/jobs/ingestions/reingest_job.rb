# frozen_string_literal: true

module Ingestions
  class ReingestJob < ApplicationJob
    def perform(ingestion, user)
      ingestion.reset
      ingestion.process(user)
      ingestion.save
    end
  end
end
