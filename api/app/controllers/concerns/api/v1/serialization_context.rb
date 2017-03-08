module Api
  module V1
    # Adds serialization context for each request.
    class SerializationContext
      delegate :[], :fetch, :[]=, to: :@data

      attr_reader :controller, :view_context, :url_options, :authenticated_as

      def initialize(controller:, current_user:)
        @data = {}
        @data[:authenticated_as] = @authenticated_as = current_user
        @data[:controller]       = @controller   = controller
        @data[:url_options]      = @url_options  = controller.url_options
      end
    end
  end
end
