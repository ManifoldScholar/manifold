require "rails_helper"

RSpec.describe Subject, type: :model do
  it "has many text subjects" do
    subject = Subject.new
    3.times { subject.text_subjects.build }
    expect(subject.text_subjects.length).to be 3
  end
end
