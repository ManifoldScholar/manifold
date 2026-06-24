# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::ResourceReference do
  {
    "Project"            => :project,
    "Text"               => :text,
    "TextSection"        => :text_section,
    "Resource"           => :resource,
    "ResourceCollection" => :resource_collection,
    "JournalIssue"       => :journal_issue
  }.each do |type, factory|
    context "for a #{type}" do
      let(:record) { FactoryBot.create(factory) }

      subject(:reference) { described_class.new(type: type, id: record.id) }

      it "resolves the record and is valid" do
        expect(reference).to be_valid
        expect(reference.entity).to eq(record)
      end

      it "exposes canonical redirect params" do
        expect(reference.redirect_params).to eq(redirect_type: type, redirect_id: record.id)
      end
    end
  end

  it "is invalid for a non-collectable type" do
    reference = described_class.new(type: "User", id: FactoryBot.create(:user).id)

    expect(reference).not_to be_valid
    expect(reference.entity).to be_nil
  end

  it "is invalid when no record matches the id" do
    expect(described_class.new(type: "Project", id: SecureRandom.uuid)).not_to be_valid
  end

  it "builds a launch URL on the Manifold host carrying the redirect params" do
    project = FactoryBot.create(:project)
    uri = URI.parse(described_class.new(type: "Project", id: project.id).launch_url)

    expect(uri.host).to eq(URI.parse(Rails.configuration.manifold.url).host)
    expect(uri.path).to eq("/lti/launch")
    expect(Rack::Utils.parse_nested_query(uri.query)).to eq("redirect_type" => "Project", "redirect_id" => project.id)
  end
end
