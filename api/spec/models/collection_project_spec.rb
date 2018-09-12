require 'rails_helper'

RSpec.describe CollectionProject, type: :model do

  it "has a valid factory" do
    expect(FactoryBot.build(:collection_project)).to be_valid
  end

end
