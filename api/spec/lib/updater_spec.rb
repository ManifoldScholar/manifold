# frozen_string_literal: true

describe Updaters::Default do
  let(:updatable) do
    FactoryBot.create(:user)
  end

  let(:invalid_params) do
    { type: "user", data: { attributes: { email: "" } } }
  end

  it "returns a model with errors if the request is invalid" do
    expect(::Updaters::User.new(invalid_params).update(updatable).valid?).to be false
  end
end
