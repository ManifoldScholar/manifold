describe Updaters::Default do

  let(:updatable) {
    FactoryBot.create(:user)
  }

  let(:invalid_params) {
    { type: "user", data: { attributes: { email: "" } } }
  }

  it "returns a model with errors if the request is invalid" do
    expect(::Updaters::User.new(invalid_params).update(updatable).valid?).to be false
  end

end
