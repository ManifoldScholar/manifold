module API
  module V1
    # Settings controller
    class SettingsController < ApplicationController

      resourceful! Settings, authorize_options: { except: [:show] } do
        Settings.instance
      end

      def show
        render_single_resource(Settings.instance, location: "")
      end

      def update
        @settings = Settings.instance
        ::Updaters::Settings.new(settings_params).update(@settings)
        render_single_resource(Settings.instance, location: "")
      end

    end
  end
end
