# frozen_string_literal: true

module API
  module V1
    module Projects
      class IngestionsController < ApplicationController
        include CreatesIngestionsFromParent

        creates_ingestions_for! Project
      end
    end
  end
end
