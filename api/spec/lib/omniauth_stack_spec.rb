require "rails_helper"

RSpec.describe OmniauthStack, middleware: true do
  let(:app) { MockRackApp.new }

  let(:middleware) { described_class.new app }

  subject { middleware }

  before(:each) do
    allow(middleware).to receive(:call_with_stack)
  end

  context '#skip?' do
    it 'skips any path with /api' do
      expect(middleware.skip?(env_for('/api/v1/categories'))).to be_truthy
    end

    it 'does not skip any omniauth paths' do
      expect(middleware.skip?(env_for('/auth/facebook/callback'))).to be_falsey
      expect(middleware.skip?(env_for('/auth/facebook'))).to be_falsey
    end
  end

  test_provider! :facebook
  test_provider! :google_oauth2
  test_provider! :twitter
end
