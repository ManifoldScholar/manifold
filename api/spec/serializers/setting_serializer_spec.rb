require "rails_helper"

RSpec.describe V1::SettingSerializer do
  it_behaves_like "a serializer" do
    let(:object) do
      settings = Settings.instance
      settings.force_theme = {}
      settings
    end

    it "includes empty hashes" do
      expect(subject.serializable_hash[:data][:attributes][:theme]).to be_a Hash
    end
  end
end
