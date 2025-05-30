# frozen_string_literal: true

require "rails_helper"

RSpec.describe V1::NotificationPreferenceSerializer do
  it_behaves_like "a serializer" do
    let(:object) { FactoryBot.build(factory) }
  end
end
