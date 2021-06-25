require "rails_helper"

# rubocop:disable Layout/LineLength
RSpec.describe Ingestions::Concerns::FileOperations do
  include TestHelpers::IngestionHelper

  let(:path) { Rails.root.join("spec","data","ingestion", "epubs", "minimal-v3.zip") }
  let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }

  subject do
    create_context(ingestion)
  end

  after(:each) do
    subject.teardown if subject.respond_to? :teardown
  end

  it("should open a relative path in a source package") do
    expect(subject.open("source/minimal-v3/EPUB/xhtml/section0001.xhtml")).to be_a File
  end

  it("should confirm that a file exists in a source package") do
    expect(subject.file?("source/minimal-v3/EPUB/xhtml/section0001.xhtml")).to be true
  end

  it("should read a relative path in a source package") do
    expect(subject.read("source/minimal-v3/EPUB/xhtml/section0001.xhtml")).to be_a String
  end

  it("should convert a relative path in a source package to an absolute path") do
    rel_path = "source/minimal-v3/EPUB/xhtml/section0001.xhtml"
    abs_path = Pathname.new(subject.abs(rel_path))
    expect(abs_path.absolute?).to be true
  end

  it("turns an relative root path into a relative path from a given resource") do
    href = "OEBPS/Text/section.xhtml"
    nav_path = "OEBPS/toc.ncx"
    rel_path = subject.relativize_ingestion_path(nav_path, href)
    expect(rel_path).to eq "Text/section.xhtml"
  end

  it("converts a relative path within the package to a path relative to the project root") do
    href = "xhtml/section0001.xhtml"
    source = "EPUB/package.opf"
    package_rel_path = subject.derelativize_ingestion_path(source, href)
    expect(package_rel_path).to eq "EPUB/xhtml/section0001.xhtml"
  end

  it("returns the ingestion basename") do
    expect(subject.basename.present?).to be true
  end

  it("returns the package working directory") do
    expect(subject.root_path).to be_a String
  end

  it("returns the package working source directory") do
    expect(subject.source_root).to be_a String
  end

  it("returns the package working build directory") do
    expect(subject.build_root).to be_a String
  end

  it("returns all the files in the ingestion") do
    expect(subject.sources).to be_a Array
  end

  context "when poorly named sources" do
    let(:path) { Rails.root.join("spec","data","ingestion", "manifest", "badly_named_sources.zip") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let(:context) { create_context(ingestion) }

    it "handles file names with spaces and quotes" do
      expect(context.sources).to match_array ["source/badly_named_sources/2 doc with spaces.docx",
                                              "source/badly_named_sources/3 markdown with spaces.md",
                                              "source/badly_named_sources/4 latex with spaces.tex",
                                              "source/badly_named_sources/5 “curly”_quotes.docx",
                                              "source/badly_named_sources/manifest.yml",
                                              "source/badly_named_sources/1_good_file.docx",
                                              "source/badly_named_sources/@public@vhost@g@gutenberg@html@files@3443@3443-8-3.txt.html"]
    end

    it "does not copy/extract tmp, hidden, or extraneous files" do
      file_names = context.sources.map { |f| File.basename f }
      expect(file_names).to_not include /^[._~].*/
    end
  end
end
