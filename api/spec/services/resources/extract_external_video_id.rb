require "rails_helper"

RSpec.describe Resources::ExtractExternalVideoId do
  describe "when external_type is 'youtube'" do
    context "when full URL" do
      let(:outcome) { described_class.run external_type: "youtube", external_id: "https://www.youtube.com?v=lVrAwK7FaOw" }

      it "extracts and returns the ID" do
        expect(outcome.result).to eq "lVrAwK7FaOw"
      end

      context "when missing protocol" do
        let(:outcome) { described_class.run external_type: "youtube", external_id: "youtube.com?v=lVrAwK7FaOw" }

        it "extracts and returns the ID" do
          expect(outcome.result).to eq "lVrAwK7FaOw"
        end
      end
    end

    context "when short URL" do
      let(:outcome) { described_class.run external_type: "youtube", external_id: "https://youtu.be/lVrAwK7FaOw" }

      it "extracts and returns the ID" do
        expect(outcome.result).to eq "lVrAwK7FaOw"
      end

      context "when missing protocol" do
        let(:outcome) { described_class.run external_type: "youtube", external_id: "youtu.be/lVrAwK7FaOw" }

        it "extracts and returns the ID" do
          expect(outcome.result).to eq "lVrAwK7FaOw"
        end
      end
    end

    context "when video ID" do
      let(:outcome) { described_class.run external_type: "youtube", external_id: "lVrAwK7FaOw" }

      it "does not change the ID" do
        expect(outcome.result).to eq "lVrAwK7FaOw"
      end
    end
  end

  describe "when external_type is 'vimeo'" do
    context "when full URL" do
      let(:outcome) { described_class.run external_type: "vimeo", external_id: "https://www.vimeo.com/249096229" }

      it "extracts and returns the ID" do
        expect(outcome.result).to eq "249096229"
      end

      context "when missing protocol" do
        let(:outcome) { described_class.run external_type: "vimeo", external_id: "vimeo.com/249096229" }

        it "extracts and returns the ID" do
          expect(outcome.result).to eq "249096229"
        end
      end
    end

    context "when video ID" do
      let(:outcome) { described_class.run external_type: "vimeo", external_id: "249096229" }

      it "does not change the ID" do
        expect(outcome.result).to eq "249096229"
      end
    end
  end

  context "when an invalid URL" do
    let(:outcome) { described_class.run external_type: "vimeo", external_id: "https://youtube.com?v=123456" }

    it "returns an error on :external_id" do
      expect(outcome.errors.keys).to include :external_id
    end
  end
end
