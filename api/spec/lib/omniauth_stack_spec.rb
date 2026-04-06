# frozen_string_literal: true

require "rails_helper"

RSpec.describe OmniauthStack, middleware: true do
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
  test_provider! :twitter
end
