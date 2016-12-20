module Api
  module V1
    # Adds serialization context for each request.
    class SerializationContext
      delegate :[], :fetch, :[]=, to: :@data

      attr_reader :controller, :view_context, :url_options

      def initialize(controller:)
        @data = {}
        @data[:controller]    = @controller   = controller
        @data[:url_options]   = @url_options  = controller.url_options
      end
    end
  end
end
