# frozen_string_literal: true

RSpec.describe V1::Helpers::Errors do
  let(:base) { FactoryBot.build(:user, email: nil, password: "a", password_confirmation: "b") }
  let(:errors) { base.errors }
  let(:helper) { described_class.new(errors) }
  let(:result) { helper.for_serialization }
  before { base.valid? }

  it "returns an array" do
    expect(result).to be_instance_of Array
  end

  it "correctly handles options" do
    count = base.errors.details[:password].first[:count]
    error = result.find { |r| r.detail.include? "minimum is" }
    expect(error.detail.include?(count.to_s)).to be true
  end
end
