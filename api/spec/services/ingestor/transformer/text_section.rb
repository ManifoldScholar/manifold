require "rails_helper"

RSpec.describe Ingestor::Transformer::TextSection do

  let(:logger) { NullLogger.new }
  let(:text) {
    text = Text.new
    text.text_sections << TextSection.new()
    text.save
    text
  }
  let(:subject) { Ingestor::Transformer::TextSection.new(text, logger) }

  it "can be instantiated with a text and a logger" do
    expect { subject }.not_to raise_error
  end

  it "rescues malformed URI errors" do
    body = <<~HEREDOC
      <p> blah blah blah
      <a href="http://dx.doi:10.1111/j.1365-2729.2006.00182.x">
      http://dx.doi:10.1111/j.1365-2729.2006.00182.x
      </a>
      blah blah blah</p>
    HEREDOC
    text.text_sections << TextSection.new(body: body)
    expect { subject.convert_cont_doc_body(body, "/") }.not_to raise_error
  end


end
