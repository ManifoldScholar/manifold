module API
  module V1
    # CallToActions controller
    class ActionCalloutsController < ApplicationController

      resourceful! ActionCallout

      def show
        @action_callout = load_and_authorize_action_callout
        render_single_resource @action_callout
      end

      def update
        @action_callout = load_and_authorize_action_callout
        ::Updaters::ActionCallout.new(action_callout_params).update(@action_callout)
        render_single_resource @action_callout
      end

      def destroy
        @action_callout = load_and_authorize_action_callout
        @action_callout.destroy
      end
    end
  end
end
