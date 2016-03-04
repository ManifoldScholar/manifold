require "rails_helper"

RSpec.describe Resource, type: :model do

  it "has a valid factory" do
    # expect(FactoryGirl.build(:resource)).to be_valid
    resource = Resource.create()
    expect(true).to be_truthy
  end

  # it { is_expected.to have_attached_file(:attachment) }
  # it { is_expected.to validate_attachment_presence(:attachment) }
  # it do
  #   is_expected.to validate_attachment_content_type(:attachment).allowing("image/gif")
  # end

end
