require 'rails_helper'

RSpec.describe Settings, type: :model do

  it "sets general settings correctly" do
    s = Settings.instance()
    s.general = { a: "a" }
    expect(s.general["a"]).to eq "a"
  end

  it "it shallow merges new general settings into existing ones" do
    s = Settings.instance()
    s.general = { a: "a" }

    s.merge_settings_into! :general, b: 'b'

    expect(s.general).to eq({ "a" => "a", "b" => "b" })
  end

end
