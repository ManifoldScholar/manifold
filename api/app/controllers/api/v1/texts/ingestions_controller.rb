# frozen_string_literal: true

module API
  module V1
    module Texts
      class IngestionsController < ApplicationController
        include CreatesIngestionsFromParent

        creates_ingestions_for! Text
      end
    end
  end
end
