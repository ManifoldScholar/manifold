# frozen_string_literal: true

module Ingestions
  class ReingestIngestionJob < ApplicationJob
    def perform(ingestion_id, user_id)
      ingestion = Ingestion.find(ingestion_id)
      user = User.find(user_id)
      ingestion.reset
      ingestion.process(user)
      ingestion.save
    end
  end
end
