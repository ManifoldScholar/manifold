require "rails_helper"

RSpec.describe Demonstration::DataLoader do

  let(:loader) { Demonstration::DataLoader.new }
  let(:settings) { Settings.instance }

  it "sets settings to ENV values if blank" do
    expect(settings.general).to eq({})
    loader.ensure_settings
    settings.reload
    expect(settings.general["ga_profile_id"]).to eq(ENV["MANIFOLD_SETTING_GENERAL_GA_PROFILE_ID"])
  end

  it "does not overwrite setting if already set" do
    settings.update_attribute("general", ga_profile_id: "rowan")
    loader.ensure_settings
    settings.reload
    expect(settings.general["ga_profile_id"]).to eq("rowan")
  end

  it "sets settings when Settings object does not exist" do
    expect(Settings.all.count).to eq(0)
    loader.ensure_settings
    expect(Settings.all.count).to eq(1)
    expect(Settings.instance.general["ga_profile_id"]).to eq(ENV["MANIFOLD_SETTING_GENERAL_GA_PROFILE_ID"])
  end

end
