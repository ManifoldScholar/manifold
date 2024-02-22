# frozen_string_literal: true

RSpec.describe Utility::Booleanize, type: :operation do
  let(:operation) { described_class.new }

  it "parses a variety of inputs correctly", :aggregate_failures do
    expect(operation.call(true)).to eq true
    expect(operation.call(?t)).to eq true
    expect(operation.call(?f)).to eq false
    expect(operation.call(0)).to eq false
    expect(operation.call(?0)).to eq false
    expect(operation.call("")).to eq false
    expect(operation.call("no")).to eq false
    expect(operation.call("yes")).to eq true
    expect(operation.call([])).to eq true
  end
end
