require "rails_helper"

RSpec.describe Annotation, type: :model do

  before(:each) do
    @annotation = FactoryGirl.build(:annotation)
  end

  it "has a valid annotation factory" do
    expect(FactoryGirl.build(:annotation)).to be_valid
  end

  it "has a valid resource annotation factory" do
    expect(FactoryGirl.build(:resource_annotation)).to be_valid
  end

  it "knows what project it belongs to" do
    @annotation.save
    expect(@annotation.project).to eq @annotation.text_section.text.project
  end

  it "is invalid when start_node is blank" do
    @annotation.start_node = ""
    expect(@annotation).to_not be_valid
  end

  it "is invalid when end_node is blank" do
    @annotation.end_node = ""
    expect(@annotation).to_not be_valid
  end

  it "is invalid when start_char is blank" do
    @annotation.start_char = ""
    expect(@annotation).to_not be_valid
  end

  it "is valid when start_char is 0" do
    @annotation.start_char = 0
    expect(@annotation).to be_valid
  end

  it "is invalid when start_char is not an integer" do
    @annotation.start_char = "zero"
    expect(@annotation).to_not be_valid
  end

  it "is invalid when end_char is blank" do
    @annotation.end_char = ""
    expect(@annotation).to_not be_valid
  end

  it "is valid when end_char is 0" do
    @annotation.end_char = 0
    expect(@annotation).to be_valid
  end

  it "is invalid when end_char is not an integer" do
    @annotation.end_char = "zero"
    expect(@annotation).to_not be_valid
  end

  it "is invalid when format is blank" do
    @annotation.format = ""
    expect(@annotation).to_not be_valid
  end

  it "is invalid when format is not in list" do
    @annotation.format = "rowan"
    expect(@annotation).to_not be_valid
  end

  it "is invalid when subject is blank" do
    @annotation.subject = ""
    expect(@annotation).to_not be_valid
  end

  it "is valid when subject is single space character" do
    @annotation.subject = " "
    expect(@annotation).to be_valid
  end

  it "invalid without a creator" do
    @annotation.creator = nil
    expect(@annotation).to_not be_valid
  end

  context "with notation" do
    it "is invalid without a resource if format is resource" do
      @annotation.format = "resource"
      expect(@annotation).to_not be_valid
    end

    it "is valid with a resource if format is resource" do
      resource = FactoryGirl.create(:resource)
      @annotation.format = "resource"
      @annotation.resource = resource
      expect(@annotation).to be_valid
    end

    it "is invalid without a collection if format is collection" do
      @annotation.format = "collection"
      expect(@annotation).to_not be_valid
    end

    it "is valid with a collection if format is collection" do
      collection = FactoryGirl.create(:collection)
      @annotation.format = "collection"
      @annotation.collection = collection
      expect(@annotation).to be_valid
    end
  end

end
