# frozen_string_literal: true

require "rails_helper"

class MockRackApp
  attr_reader :request_body

  def initialize
    @request_headers = {}
  end

  def call(env)
    @env = env

    [200, { 'Content-Type' => 'text/plain' }, ['OK']]
  end

  def [](key)
    @env.try(:[], key)
  end
end

RSpec.describe OmniauthStack, middleware: true do
  def env_for(path)
    Rack::MockRequest.env_for(path)
  end

  def full_env_for(path)
    ActionDispatch::TestRequest.create(env_for(path)).env
  end
  class << self
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
  let(:app) { MockRackApp.new }

  let(:middleware) { described_class.new app }

  subject { middleware }

  before do
    allow(middleware).to receive(:call_with_stack)
  end

  describe '#skip?' do
    it 'skips any path with /api' do
      expect(middleware).to be_skip(env_for('/api/v1/categories'))
    end

    it 'does not skip any omniauth paths' do
      expect(middleware).not_to be_skip(env_for('/auth/facebook/callback'))
      expect(middleware).not_to be_skip(env_for('/auth/facebook'))
    end
  end

  test_provider! :facebook
  test_provider! :google_oauth2
end
