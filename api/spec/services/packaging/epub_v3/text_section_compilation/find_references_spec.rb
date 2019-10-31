require "rails_helper"

RSpec.describe Packaging::EpubV3::TextSectionCompilation::FindReferences, packaging: true do
  let!(:operation) { described_class.new }

  let!(:html_content) do
    <<~HTML
    <!doctype html>
    <html xmlns:xml="http://www.w3.org/XML/1998/namespace" xmlns:epub="http://www.idpf.org/2007/ops" epub:prefix="z3998: http://www.daisy.org/z3998/2012/vocab/structure/#, se: https://standardebooks.org/vocab/1.0">
      <head>
        <title>Some Title</title>
        <link type="text/css" href="https://example.com/style.css" />
      </head>
      <body class="manifold-text-section">
        <img src="../relative/path.jpg" />

        <video poster="../poster.jpg" controls>
          <source src="https://example.com/video.mp4" type="video/mp4" />
          <source src="https://example.com/video.ogg" type="video/ogg" />
          <p>Fallback text</p>
        </video>

        <audio controls>
          <source src="https://example.com/audio.ogg" type="audio/ogg" />
          <source src="https://example.com/audio.mp3" type="audio/mp3" />
        </audio>
      </body>
    </html>
    HTML
  end

  let(:document) { Nokogiri::HTML(html_content) }

  let(:state) { { document: document } }

  it "finds references in the HTML and adds them to the state" do
    expect do
      @references = operation.call state
    end.to execute_safely

    expect(@references).to have(7).items
  end
end
