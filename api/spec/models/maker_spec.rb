require "rails_helper"

RSpec.describe Maker, type: :model do
  it "has many collaborators" do
    maker = Maker.new
    5.times { maker.collaborators << Collaborator.new }
    expect(maker.collaborators.length).to be 5
  end
end
