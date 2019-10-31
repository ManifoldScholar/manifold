require "rails_helper"

describe CoreMediaTypeKind, packaging: true, type: :enum do
  let(:enum) { described_class.new }

  subject { enum }

  describe ".match" do
    class << self
      def matches(content_type, expected_kind)
        it "matches #{content_type.inspect} to #{expected_kind.inspect}" do
          expect(described_class.match(content_type)).to eq expected_kind
        end
      end
    end

    matches "image/gif", :image
    matches "audio/mp4", :audio
    matches "video/mp4", :video
    matches "text/css", :style
    matches "font/woff2", :font
    matches "application/xhtml+xml", :other
    matches "application/x-gzip", :unknown
  end

  shared_examples_for "something with statically defined MIME types" do
    describe ".mime_pattern" do
      subject { described_class.mime_pattern }

      it "matches every defined MIME type" do
        is_expected.to satisfy("matches every MIME type") { |v| described_class.mime_types.all? { |type| v =~ type } }
      end
    end

    describe ".mime_types" do
      subject { described_class.mime_types }

      it "describes an array of MIME types" do
        is_expected.to be_present.and all(a_kind_of(String))
      end
    end
  end

  shared_examples_for "something with no statically defined MIME types" do
    describe ".mime_pattern" do
      subject { described_class.mime_pattern }

      it { is_expected.to be_a_kind_of(Regexp) }
    end

    describe ".mime_types" do
      subject { described_class.mime_types }

      it { is_expected.to be_blank }
    end
  end

  include_examples "something with statically defined MIME types"

  describe CoreMediaTypeKind::Image do
    it { is_expected.to be_a_core_media_type }
    it { is_expected.to be_a_should_download }
    it { is_expected.to have_match "image/gif" }
    it { is_expected.to have_match "image/png" }
    it { is_expected.to have_match "image/jpeg" }
    it { is_expected.to have_match "image/svg+xml" }

    include_examples "something with statically defined MIME types"
  end

  describe CoreMediaTypeKind::Audio do
    it { is_expected.to be_a_core_media_type }
    it { is_expected.not_to be_a_should_download }
    it { is_expected.to have_match "audio/mp4" }

    include_examples "something with statically defined MIME types"
  end

  describe CoreMediaTypeKind::Video do
    it { is_expected.to be_a_core_media_type }
    it { is_expected.not_to be_a_should_download }
    it { is_expected.to have_match "video/anything" }
    it { is_expected.to have_match "video/mp4" }

    include_examples "something with no statically defined MIME types"
  end

  describe CoreMediaTypeKind::Style do
    it { is_expected.to be_a_core_media_type }
    it { is_expected.to be_a_should_download }
    it { is_expected.to have_match "text/css" }

    include_examples "something with statically defined MIME types"
  end

  describe CoreMediaTypeKind::Font do
    it { is_expected.to be_a_core_media_type }
    it { is_expected.not_to be_a_should_download }
    it { is_expected.to have_match "font/ttf" }
    it { is_expected.to have_match "font/woff" }

    include_examples "something with statically defined MIME types"
  end

  describe CoreMediaTypeKind::Other do
    it { is_expected.to be_a_core_media_type }
    it { is_expected.to be_a_should_download }

    include_examples "something with statically defined MIME types"
  end

  describe CoreMediaTypeKind::Unknown do
    it { is_expected.not_to be_a_core_media_type }
    it { is_expected.not_to be_a_should_download }

    include_examples "something with no statically defined MIME types"
  end
end
