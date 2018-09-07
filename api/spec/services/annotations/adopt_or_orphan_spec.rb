RSpec.describe Annotations::AdoptOrOrphan do
  context "with a complex text structure" do
    let(:text_section) do
      body_json = { "tag" => "div",
                    "children" =>
         [{ "tag" => "p",
            "children" =>
             [{ "content" => "\n    Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon\n    amaranth tatsoi tomatillo melon azuki bean garlic.\n  ",
                "node_type" => "text",
                "node_uuid" => "0bb94ee45a770f168b5d0ed85b5f6f519cd6cd9d",
                "text_digest" => "781cff09725fd23cd984b46c0670624b17c8b342" }],
            "node_type" => "element",
            "attributes" => {} },
          { "tag" => "p",
            "children" =>
             [{ "content" =>
                 "\n    Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea\n    sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber\n    earthnut pea peanut soko zucchini.\n  ",
                "node_type" => "text",
                "node_uuid" => "5f2848b941af1ae0c28d27a8b0d553ea9eaa4eb4",
                "text_digest" => "a28fa3ae579dd5777140b06d26ff61c6635fb16a" }],
            "node_type" => "element",
            "attributes" => {} },
          { "tag" => "p",
            "children" =>
             [{ "content" =>
                 "\n    Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi\n    amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale.\n    Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water\n    spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion\n    chickpea gram corn pea. Whan that Aprille with his shoures soote the droghte of Marche\n    hath perced to the roote, And bathed every veyne in swich licour of which vertu\n    engendred is the flour...than longen folk to goon on pilgrimages. Brussels sprout\n    coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress.\n    Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.\n  ",
                "node_type" => "text",
                "node_uuid" => "d1603a807fc4e475f1d55ff989743a9239f26ed9",
                "text_digest" => "c84afa9fab1402105f58eb6e54b64726097d6f2d" }],
            "node_type" => "element",
            "attributes" => {} },
          { "tag" => "p",
            "children" =>
             [{ "content" =>
                 "\n    Nori grape silver beet broccoli kombu beet greens fava bean potato quandong celery.\n    Bunya nuts black-eyed pea prairie turnip leek lentil turnip greens parsnip. Sea\n    lettuce lettuce water chestnut eggplant winter purslane fennel azuki bean earthnut pea\n    sierra leone bologi leek soko chicory celtuce parsley jícama salsify.\n  ",
                "node_type" => "text",
                "node_uuid" => "731817dbf0b8c6d334ae40d53a4c2805c8b27c12",
                "text_digest" => "51226ede98c73433b15222ae21398aeb6fab7757" }],
            "node_type" => "element",
            "attributes" => {} }],
                    "node_type" => "element",
                    "attributes" => {} }
      FactoryBot.create(:text_section, body_json: body_json)
    end

    it "places an orphaned annotation when text is contained in a single node" do
      annotation = FactoryBot.create(
        :annotation,
        text_section: text_section,
        subject: <<~TEXT
          Whan that Aprille with his shoures soote the droghte of Marche hath perced to 
          the roote, And bathed every veyne in swich licour of which vertu engendred is 
          the flour...than longen folk to goon on pilgrimages.
        TEXT
      )
      Annotations::AdoptOrOrphan.run annotation: annotation
      expect(annotation.start_node).to eq "d1603a807fc4e475f1d55ff989743a9239f26ed9"
      expect(annotation.end_node).to eq "d1603a807fc4e475f1d55ff989743a9239f26ed9"
    end

    it "places an orphaned annotation when the text spans two nodes" do
      annotation = FactoryBot.create(
        :annotation,
        text_section: text_section,
        subject: "bell pepper artichoke.    \n Nori grape silver beet broccoli kombu"
      )
      Annotations::AdoptOrOrphan.run annotation: annotation
      expect(annotation.start_node).to eq "d1603a807fc4e475f1d55ff989743a9239f26ed9"
      expect(annotation.end_node).to eq "731817dbf0b8c6d334ae40d53a4c2805c8b27c12"
    end

    it "does not place an annotation when placement is ambiguous" do
      annotation = FactoryBot.create(
        :annotation,
        text_section: text_section,
        subject: "kombu"
      )
      Annotations::AdoptOrOrphan.run annotation: annotation
      expect(annotation.orphaned).to be true
    end

  end

  context "with a simple text structure" do
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
end
