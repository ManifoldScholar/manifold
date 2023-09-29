# frozen_string_literal: true

RSpec.describe CollectionProject, type: :model do
  it "has a valid factory" do
    expect do
      FactoryBot.create(:collection_project)
    end.to change(described_class, :count).by(1)
  end
end
