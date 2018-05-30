require "rails_helper"

RSpec.describe Ingestor::Ingestion do

  describe "when preprocessing HTML ingestions" do

    before(:all) do
      @markup = <<~HEREDOC
        <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>A Third University Is Possible</title>
          <link rel="stylesheet" type="text/css" href="a-stylesheet.css">
          <style type="text/css">
            .some-class {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h1>Header</h1>
          <p>
            <span class="some-class" style="font-weight: bold">A</span>
            <span style="font-weight: bold">B</span>
            <span style="text-decoration: underline">C</span>
          </p>
          <h2>Header 2</h2>
        </body>
        </html>
      HEREDOC

      @processed = <<~HEREDOC
        <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>A Third University Is Possible</title>
          <link rel="stylesheet" type="text/css" href="a-stylesheet.css">
          <style type="text/css">
            .some-class {
              font-weight: bold;
            }
          </style>
        <style type="text/css">
          .extracted-inline-style-1 {
            font-weight: bold;
          }
          .extracted-inline-style-2 {
            text-decoration: underline;
          }
        </style>
        </head>
        <body>
          <h1 id="7bb1d4bc782b85bab1c21794a97a30df">Header</h1>
          <p>
            <span class="some-class extracted-inline-style-1">A</span>
            <span class="extracted-inline-style-1">B</span>
            <span class="extracted-inline-style-2">C</span>
          </p>
          <h2 id="c58aad67287546f0ffcdb54c1b1f5b0c">Header 2</h2>
        </body>
        </html>
      HEREDOC
    end

    before(:each) do
      @file = Tempfile.new("html_spec_test")
      @path = @file.path
      @file.write(@markup)
      @file.rewind
    end

    after(:each) do
      @file.unlink
    end

    it "correctly processes the HTML" do
      ::Ingestor::Preprocessor::HTML.process!(@path)
      expect(File.open(@path).read).to eq @processed
    end

  end

end
