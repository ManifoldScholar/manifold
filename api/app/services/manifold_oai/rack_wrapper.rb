# frozen_string_literal: true

module ManifoldOAI
  class RackWrapper
    attr_reader :provider

    def initialize
      @provider = ManifoldOAI::Provider.new(provider_context: :instance_based)
    end

    def call(env)
      request = Rack::Request.new(env)

      body = provider.process_request(request.params)

      headers = {
        Rack::CONTENT_LENGTH => body.bytesize,
        Rack::CONTENT_TYPE => "text/xml",
      }

      response = Rack::Response.new(body, 200, headers)

      response.to_a
    end

    class << self
      def instance
        @instance ||= new
      end

      def call(...)
        instance.(...)
      end
    end
  end
end
