require 'rails_helper'

RSpec.describe Settings, type: :model do

  it "sets general settings correctly" do
    s = Settings.instance()
    s.general = { a: "a" }
    expect(s.general["a"]).to eq "a"
  end

  it "has default values" do
    s = Settings.instance()
    expect(s.general["installation_name"]).to eq "Manifold"
  end

  it "it shallow merges new general settings into existing ones" do
    s = Settings.instance()
    s.general = { a: "a" }
    s.merge_settings_into! :general, b: 'b'
    expect(s.general[:a]).to eq ("a")
    expect(s.general[:b]).to eq ("b")
  end

end
