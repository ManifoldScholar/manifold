RSpec.shared_examples_for "a fingerprint interaction" do
  it "returns a hexdigest string by default" do
    perform_within_expectation!

    expect(@outcome.result).to be_a_kind_of String
  end

  context "when :raw" do
    let_input!(:raw) { true }

    it "returns the raw digest" do
      perform_within_expectation!

      expect(@outcome.result).to be_a_kind_of Digest::SHA512
    end
  end

  context "when :nested" do
    let_input!(:nested) { true }
    let_input!(:digest) { Digest::SHA512.new }

    it "returns the inherited digest" do
      perform_within_expectation!

      expect(@outcome.result).to be digest
    end
  end
end
