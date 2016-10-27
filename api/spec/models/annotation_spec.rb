require "rails_helper"

RSpec.describe Annotation, type: :model do

  it "knows what project it belongs to" do
    annotation = FactoryGirl.create(:annotation)
    expect(annotation.project).to eq annotation.text_section.text.project
  end

end
