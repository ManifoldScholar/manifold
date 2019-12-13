require "rails_helper"

RSpec.describe Utility::Counter do
  let(:initial_value) { 0 }

  let(:counter) { described_class.new initial_value }

  subject { counter }

  def test_counter!(expected:)
    expect do
      @counted = counter.call do |c|
        yield c
      end
    end.to keep_the_same(counter, :to_int)

    expect(@counted).to eq expected
    expect(counter.to_i).to eq initial_value
  end

  it "can count various integers" do
    test_counter! expected: 1 do |c|
      c += 2
      c -= 1
    end

    expect(@counted).to eq 1

    expect(counter.to_i).to eq initial_value
  end

  context "with a non-zero initial value" do
    let(:initial_value) { 7 }

    it "resets to the initial value after counting" do
      test_counter! expected: 4 do |c|
        c.decrement 3
      end
    end
  end
end
