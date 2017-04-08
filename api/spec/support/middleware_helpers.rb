module MiddlewareHelpers
  extend ActiveSupport::Concern

  def env_for(path)
    Rack::MockRequest.env_for(path)
  end

  def full_env_for(path)
    ActionDispatch::TestRequest.create(env_for(path)).env
  end

  class_methods do
    def it_calls_with_stack(route)
      it "loads the full stack for #{route}" do
        expect do
          middleware.call(full_env_for(route))
        end.not_to raise_error

        expect(middleware).to have_received(:call_with_stack)
      end
    end

    def test_provider!(provider)
      context "with auth routes for provider: #{provider}" do
        it_calls_with_stack "/auth/#{provider}"
        it_calls_with_stack "/auth/#{provider}/callback"
      end
    end
  end
end

class MockRackApp
  attr_reader :request_body

  def initialize
    @request_headers = {}
  end

  def call(env)
    @env = env

    [200, {'Content-Type' => 'text/plain'}, ['OK']]
  end

  def [](key)
    @env.try(:[], key)
  end
end

RSpec.configure do |config|
  config.include MiddlewareHelpers, middleware: true
end
