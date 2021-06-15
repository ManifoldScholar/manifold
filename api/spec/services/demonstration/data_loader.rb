require "rails_helper"

RSpec.describe Demonstration::DataLoader do

  let(:loader) { Demonstration::DataLoader.new }
  let(:settings) { Settings.instance }

  it "does not overwrite setting if already set" do
    settings.update_attribute("general", ga_tracking_id: "rowan")
    loader.ensure_settings
    settings.reload
    expect(settings.general["ga_tracking_id"]).to eq("rowan")
  end

end
