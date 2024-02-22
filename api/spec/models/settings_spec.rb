# frozen_string_literal: true

RSpec.describe Settings, type: :model do
  let_it_be(:instance, refind: true) { described_class.instance }

  it "sets unknown general settings correctly" do
    expect do
      instance.general = { a: ?a }
    end.to change { instance.general[?a] }.from(nil).to(?a)
      .and change { instance.general.unknown_attributes.include?(?a) }.from(false).to(true)
  end

  it "persists directly assigned hash settings correctly" do
    expect do
      instance.ingestion = { mammoth_style_map: "foo bar" }
      instance.save!
    end.to change { instance.reload.ingestion[:mammoth_style_map] }.to("foo bar")
  end

  it "handles shallow merges" do
    expect do
      instance.general = { a: "a" }
      instance.merge_settings_into! :general, b: 'b'
    end.to change { instance.general[?a] }.from(nil).to(?a)
      .and change { instance.general[?b] }.from(nil).to(?b)
      .and change { instance.general.unknown_attributes.keys & %w[a b] }.from([]).to(%w[a b])
  end

  context "when detecting whether to update from the environment" do
    subject { described_class }

    context "when the var is truthy" do
      before do
        stub_env "MANAGE_SETTINGS_FROM_ENV", ?1
      end

      it { is_expected.to be_manage_from_env }
      it { is_expected.to be_update_from_environment }
    end

    context "when the var is unset / blank" do
      before do
        stub_env "MANAGE_SETTINGS_FROM_ENV", ""
      end

      it { is_expected.not_to be_manage_from_env }
      it { is_expected.not_to be_update_from_environment }
    end
  end
end
