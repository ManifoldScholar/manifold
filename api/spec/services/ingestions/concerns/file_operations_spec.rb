require "rails_helper"

# rubocop:disable Metrics/LineLength
RSpec.describe Ingestions::Concerns::FileOperations do
  let(:ingestion) { FactoryBot.create(:ingestion) }

  subject do
    path = Rails.root.join("spec","data","ingestion", "epubs","minimal-v3")
    allow(ingestion).to receive(:ingestion_source).and_return path
    Ingestions::Context.new(ingestion)
  end

  after(:each) do
    subject.teardown
  end

  it("should open a relative path in a source package") do
    expect(subject.open("source/EPUB/xhtml/section0001.xhtml")).to be_a File
  end

  it("should confirm that a file exists in a source package") do
    expect(subject.file?("source/EPUB/xhtml/section0001.xhtml")).to be true
  end

  it("should read a relative path in a source package") do
    expect(subject.read("source/EPUB/xhtml/section0001.xhtml")).to be_a String
  end

  it("should convert a relative path in a source package to an absolute path") do
    rel_path = "source/EPUB/xhtml/section0001.xhtml"
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
    expect(subject.basename).to eq "minimal-v3"
  end

  it("does not return an extension when a directory is the ingestion subject") do
    expect(subject.extension).to be nil
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
end
