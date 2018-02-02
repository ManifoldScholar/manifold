require "rails_helper"

RSpec.describe Subject, type: :model do

  it "has many text subjects" do
    subject = FactoryBot.create(:subject)
    3.times { subject.text_subjects.build }
    expect(subject.text_subjects.length).to be 3
  end

  it "has many project subjects" do
    subject = FactoryBot.create(:subject)
    3.times { subject.project_subjects.build }
    expect(subject.project_subjects.length).to be 3
  end

  it "is invalid without a name" do
    subject = FactoryBot.build(:subject, name: nil)
    expect(subject).to_not be_valid
  end

end
