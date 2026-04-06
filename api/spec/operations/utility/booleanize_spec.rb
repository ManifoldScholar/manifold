# frozen_string_literal: true

RSpec.describe Utility::Booleanize, type: :operation do
  let(:operation) { described_class.new }

  it "parses a variety of inputs correctly", :aggregate_failures do
    expect(operation.call(true)).to be true
    expect(operation.call(?t)).to be true
    expect(operation.call(?f)).to be false
    expect(operation.call(0)).to be false
    expect(operation.call(?0)).to be false
    expect(operation.call("")).to be false
    expect(operation.call("no")).to be false
    expect(operation.call("yes")).to be true
    expect(operation.call([])).to be true
  end
end
