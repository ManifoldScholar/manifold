# frozen_string_literal: true

require "rails_helper"

RSpec.describe Ingestions::Context do
  include TestHelpers::IngestionHelper

  let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
  let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }

  subject { create_context(ingestion) }

  describe "#teardown" do
    it "removes the working directory" do
      root_path = subject.root_path
      expect(File.directory?(root_path)).to be true
      subject.teardown
      expect(File.directory?(root_path)).to be false
    end

    it "closes and unlinks the downloaded source tempfile" do
      source_path = subject.source_path
      expect(File.exist?(source_path)).to be true
      subject.teardown
      expect(File.exist?(source_path)).to be false
    end

    it "closes and unlinks tempfiles registered with #track_tempfile" do
      tempfile = Tempfile.new("tracked")
      subject.track_tempfile(tempfile)
      tracked_path = tempfile.path

      subject.teardown

      expect(tempfile.closed?).to be true
      expect(File.exist?(tracked_path)).to be false
    end

    it "does not raise when a tracked tempfile was already closed" do
      tempfile = Tempfile.new("tracked")
      subject.track_tempfile(tempfile)
      tempfile.close!

      expect { subject.teardown }.not_to raise_error
    end
  end
end
