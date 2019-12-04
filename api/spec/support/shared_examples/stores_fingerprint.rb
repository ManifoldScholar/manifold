RSpec.shared_examples_for "a model that stores its fingerprint" do
  it "can recalculate its fingerprint" do
    expect do
      subject.recalculate_fingerprint!
    end.not_to raise_error
  end
end
