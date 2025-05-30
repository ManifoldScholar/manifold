# frozen_string_literal: true

module Ingestions
  class ProcessJob < ApplicationJob
    def perform(ingestion, user)
      ingestion.process(user)
      ingestion.save
    end
  end
end
