module Api
  module V1
    # CallToActions controller
    class CallToActionsController < ApplicationController

      resourceful! CallToAction

      def update
        @call_to_action = load_and_authorize_call_to_action
        ::Updaters::Default.new(call_to_action_params).update(@call_to_action)
        render_single_resource @call_to_action
      end

      def destroy
        @call_to_action = load_and_authorize_call_to_action
        @call_to_action.destroy
      end
    end
  end
end
