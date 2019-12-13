RSpec.shared_examples_for "a model that stores its fingerprint" do
  it "can recalculate its fingerprint" do
    expect do
      subject.recalculate_fingerprint!
    end.not_to raise_error
  end

  context "when the fingerprint has fallen out of sync" do
    let(:invalid_fingerprint) { "thisisnotarealvalue" }

    before do
      subject.update_column :fingerprint, invalid_fingerprint
    end

    it "will reset on calculation" do
      expect do
        subject.calculate_fingerprint
      end.to change(subject, :fingerprint).from(invalid_fingerprint).to(/\A[a-z0-9]{128}\z/)
    end
  end
end
