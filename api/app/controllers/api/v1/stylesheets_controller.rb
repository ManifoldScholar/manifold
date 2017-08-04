module Api
  module V1
    # Stylesheets controller
    class StylesheetsController < ApplicationController
      before_action :set_text

      resourceful! Stylesheet, authorize_options: { except: [:index, :show] } do
        @text.nil? ? Stylesheet : @text.stylesheets
      end

      # GET /stylesheets/1
      def show
        @stylesheet = load_stylesheet
        render_single_resource(
          @stylesheet,
          location: location(@stylesheet)
        )
      end

      def create
        @stylesheet = ::Updaters::Stylesheet
                      .new(stylesheet_params)
                      .update_without_save(@text.stylesheets.new)
        authorize_action_for @stylesheet
        @stylesheet.creator = @current_user
        @stylesheet.save
        render_single_resource(
          @stylesheet,
          serializer: set_serializer,
          location: location(@stylesheet)
        )
      end

      def update
        @stylesheet = load_and_authorize_stylesheet
        ::Updaters::Stylesheet.new(stylesheet_params).update(@stylesheet)
        render_single_resource(
          @stylesheet,
          serializer: set_serializer,
          location: location(@stylesheet)
        )
      end

      def destroy
        @stylesheet = load_and_authorize_stylesheet
        @stylesheet.destroy
      end

      private

      def location(_stylesheet)
        # TODO: Return a proper location
        ""
      end

      def set_text
        @text = Text.friendly.find(params[:text_id]) if params[:text_id]
      end

      def set_serializer
        return error_serializer unless @stylesheet.valid?
        StylesheetSerializer
      end

    end
  end
end
