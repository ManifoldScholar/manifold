module API
  module V1
    # events controller
    class EventsController < ApplicationController

      resourceful! Event, authorize_options: { only: [:destroy] } do
        Event.filtered(with_pagination!(event_filter_params))
      end

      def destroy
        @event = load_and_authorize_event
        @event.destroy
      end
    end
  end
end
