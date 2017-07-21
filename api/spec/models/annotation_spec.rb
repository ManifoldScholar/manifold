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

  context "can be filtered" do

    before(:each) do
      @project_a =  FactoryGirl.create(:project, title: "project_a")
      @project_b = FactoryGirl.create(:project, title: "project_b")
      @text_a = FactoryGirl.create(:text, project: @project_a)
      @text_b = FactoryGirl.create(:text, project: @project_b)
      @text_section_a = FactoryGirl.create(:text_section, text: @text_a)
      @text_section_b = FactoryGirl.create(:text_section, text: @text_b)
      @annotation_a = FactoryGirl.create(:annotation, text_section: @text_section_a)
      @annotation_b = FactoryGirl.create(:annotation, text_section: @text_section_a)
      @annotation_c = FactoryGirl.create(:annotation, text_section: @text_section_b)
    end

    it "by project" do
      results = Annotation.filter(project: @project_a)
      expect(results.count).to eq(2)
    end

    it "by text" do
      results = Annotation.filter(text: @text_a)
      expect(results.count).to eq(2)
    end

    it "by text section" do
      results = Annotation.filter(text_section: @text_section_b)
      expect(results.count).to eq(1)
    end

    it "by ids" do
      results = Annotation.filter(ids: [@annotation_a.id, @annotation_b.id])
      expect(results.count).to eq(2)
    end
  end

end
