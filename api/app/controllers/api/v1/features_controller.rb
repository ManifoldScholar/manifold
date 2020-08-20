module API
  module V1
    # Features controller
    class FeaturesController < ApplicationController

      resourceful! Feature, authorize_options: { except: [:index, :show] } do
        Feature.filtered(feature_filter_params || {})
      end

      def index
        @features = load_features
        render_multiple_resources(@features)
      end

      def show
        @feature = load_feature
        render_single_resource(@feature)
      end

      def create
        @feature = authorize_and_create_feature(feature_params, ::Updaters::Feature)
        render_single_resource(@feature)
      end

      def update
        @feature = load_and_authorize_feature
        ::Updaters::Feature.new(feature_params).update(@feature)
        render_single_resource(@feature)
      end

      def destroy
        @feature = load_and_authorize_feature
        @feature.destroy
      end
    end
  end
end
