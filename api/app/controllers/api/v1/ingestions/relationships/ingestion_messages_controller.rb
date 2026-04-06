# frozen_string_literal: true

module API
  module V1
    module Ingestions
      module Relationships
        class IngestionMessagesController < ApplicationController
          resourceful! Ingestion, authorize_options: { except: %i[index] }

          def index
            @ingestion = load_ingestion

            authorize_action_for @ingestion

            permitted = params.permit(:starting_at)

            time = permitted[:starting_at].present? ? Time.zone.parse(permitted[:starting_at]) : nil

            render_multiple_resources @ingestion.ingestion_messages.where(
              created_at: time..Time.current
            )
          end
        end
      end
    end
  end
end
