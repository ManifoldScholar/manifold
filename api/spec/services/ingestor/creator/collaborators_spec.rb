require "rails_helper"

RSpec.describe Ingestor::Creator::Collaborators do

  let(:text) { FactoryGirl.create(:text) }
  let(:creator) { Ingestor::Creator::Collaborators.new(Rails.logger, text) }
  let(:inspector) {
    double("Inspector", name: "name", sort_name: "name", role: "creator")
  }
  let(:inspectors) { [inspector, inspector, inspector]}

  it "responds to logger methods" do
    expect(creator).to respond_to(:info)
    expect(creator).to respond_to(:debug)
    expect(creator).to respond_to(:error)
    expect(creator).to respond_to(:warn)
  end

  it "creates a collaborator for each metadata creator node" do
    models = creator.create(inspectors)
    expect(models.length).to eq(inspectors.length)
  end

  it "updates existing objects rather than create new ones" do
    text = FactoryGirl.create(:text)
    creator = Ingestor::Creator::Collaborators.new(Rails.logger, text)
    alfred = FactoryGirl.create(:maker, name: "Alfred Hitchcock")
    wim = FactoryGirl.create(:maker, name: "Wim Wenders")

    FactoryGirl.create(:collaborator, maker: wim, text: text)
    FactoryGirl.create(:collaborator, maker: alfred, text: text)

    inspectors = [
      double("Inspector", name: "Alfred Hitchcock", sort_name: "", role: "creator"),
      double("Inspector", name: "Wim Wenders", sort_name: "", role: "creator"),
      double("Inspector", name: "Robert Altman", sort_name: "", role: "creator")
    ]

    models = creator.create(inspectors)
    models.each(&:save)
    expect(text.collaborators.count).to eq 3
    expect(text.collaborators.pluck(:id)).to match_array models.pluck(:id)
  end

end
