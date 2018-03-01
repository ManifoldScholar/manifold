shared_examples_for "a citable class with_citable_children" do
  context "when it is not citable" do
    it "does not update child citations" do
      expect(@child_class.citations).to eq({})
    end
  end

  context "when it is citable" do
    it "updates child citations" do
      allow(@calling_class).to receive(:citation_parts).and_return({ author: "Rowan", issued: Date.today, title: "Some Title"})
      @calling_class.save
      expect(@child_class).to_not eq({})
    end
  end
end
