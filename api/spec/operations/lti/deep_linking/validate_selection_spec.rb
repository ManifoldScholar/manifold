# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::DeepLinking::ValidateSelection do
  let(:project) { FactoryBot.create(:project) }
  let(:accept_types) { ["ltiResourceLink"] }
  let(:accept_multiple) { true }
  let(:context) do
    instance_double(Lti::DeepLinking::Context, accept_types: accept_types, accept_multiple: accept_multiple)
  end
  let(:selection) { [{ "type" => "Project", "id" => project.id, "title" => "Intro" }] }

  subject(:result) { described_class.new(context, selection).call }

  it "returns the resolved references on a valid selection" do
    expect(result).to be_success
    expect(result.value!.map(&:entity)).to eq([project])
  end

  context "when an item is missing its type and id" do
    let(:selection) { [{ "title" => "x" }] }

    it "fails 422 with per-field pointers" do
      expect(result.failure[:status]).to eq(422)
      pointers = result.failure[:errors].map { |e| e.source[:pointer] }
      expect(pointers).to include("/data/attributes/selection/0/type", "/data/attributes/selection/0/id")
    end
  end

  context "when the selection is blank" do
    let(:selection) { [] }

    it "fails 422" do
      expect(result.failure[:status]).to eq(422)
    end
  end

  context "when the session does not accept resource links" do
    let(:accept_types) { ["file"] }

    it "fails 400 as an invalid selection" do
      expect(result.failure[:status]).to eq(:bad_request)
      expect(result.failure[:errors].first.title).to eq("Invalid Selection")
    end
  end

  context "when accept_multiple is false and multiple items are submitted" do
    let(:accept_multiple) { false }
    let(:selection) do
      [{ "type" => "Project", "id" => project.id }, { "type" => "Project", "id" => FactoryBot.create(:project).id }]
    end

    it "fails 400" do
      expect(result.failure[:status]).to eq(:bad_request)
    end
  end

  context "when a reference does not resolve to a linkable entity" do
    let(:selection) { [{ "type" => "Project", "id" => SecureRandom.uuid }] }

    it "fails 400" do
      expect(result.failure[:status]).to eq(:bad_request)
    end
  end
end
