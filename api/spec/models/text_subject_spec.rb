require "rails_helper"

RSpec.describe TextSubject, type: :model do
  it "belongs to a text" do
    text_subject = TextSubject.new
    text = Text.new
    text_subject.text = text
    expect(text_subject.text).to be text
  end

  it "belongs to a subject" do
    text_subject = TextSubject.new
    subject = Subject.new
    text_subject.subject = subject
    expect(text_subject.subject).to be subject
  end
end
