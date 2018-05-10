RSpec.describe Annotations::AdoptOrOrphan do
  let(:text_section) do
    body_json = {
      "node_uuid" => "A",
      "tag" => "section",
      "node_type" => "element",
      "children" => [
        {
          "node_uuid" => "B",
          "tag" => "p",
          "node_type" => "text",
          "content" => "One, two, blue, "
        },
        {
          "node_uuid" => "C",
          "tag" => "p",
          "node_type" => "text",
          "content" => "three, four, "
        },
        {
          "node_uuid" => "D",
          "tag" => "p",
          "node_type" => "text",
          "content" => "five, six. blue."
        }
      ]
    }

    FactoryBot.create(:text_section, body_json: body_json)
  end

  describe "determines the start/end nodes by subject content" do
    before(:each) do
      @annotation = FactoryBot.create(:annotation,
                                  text_section: text_section,
                                  start_node: "F",
                                  end_node: "G",
                                  subject: "three, four, five,")
      Annotations::AdoptOrOrphan.run annotation: @annotation
    end

    it "has the correct start node" do
      expect(@annotation.start_node).to eq "C"
    end

    it "has the correct end node" do
      expect(@annotation.end_node).to eq "D"
    end

    it "has the correct start char" do
      expect(@annotation.start_char).to eq 1
    end

    it "has the correct end char" do
      expect(@annotation.end_char).to eq 4
    end
  end

  context "when parent nodes are still present" do
    context "when content in range has not changed" do
      it "maintains the current parent nodes" do
        annotation = FactoryBot.create(:annotation,
                                       text_section: text_section,
                                       start_node: "B",
                                       end_node: "C",
                                       subject: "One, two, blue, three, four, ")
        Annotations::AdoptOrOrphan.run annotation: annotation
        expect(annotation.attributes.slice("start_node", "end_node").values).to eq %w(B C)
      end
    end

    context "when content in range has changed" do
      it "marks the annotation as orphaned" do
        annotation = FactoryBot.create(:annotation,
                                       text_section: text_section,
                                       start_node: "B",
                                       end_node: "D",
                                       subject: "One, two, blue, five, six.")
        Annotations::AdoptOrOrphan.run annotation: annotation
        expect(annotation.orphaned).to eq true
      end
    end

    context "when nodes have duplicate content" do
      it "maintains the current parent nodes" do
        annotation = FactoryBot.create(:annotation,
                                       text_section: text_section,
                                       start_node: "D",
                                       end_node: "D",
                                       subject: "blue")
        Annotations::AdoptOrOrphan.run annotation: annotation
        expect(annotation.attributes.slice("start_node", "end_node").values).to eq %w(D D)
      end
    end
  end

  context "when new nodes are found" do
    context "when nodes have duplicate content" do
      it "marks the annotation as orphaned" do
        annotation = FactoryBot.create(:annotation,
                                       text_section: text_section,
                                       start_node: "F",
                                       end_node: "F",
                                       subject: "blue")
        Annotations::AdoptOrOrphan.run annotation: annotation
        expect(annotation.orphaned).to eq true
      end
    end
  end

  context "when no parent nodes are found" do
    it "marks the annotation as orphaned" do
      annotation = FactoryBot.create(:annotation,
                                      text_section: text_section,
                                      start_node: "H",
                                      end_node: "E",
                                      subject: "Seven, eight.")
      Annotations::AdoptOrOrphan.run annotation: annotation
      expect(annotation.orphaned).to eq true
    end
  end
end
