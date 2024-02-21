# frozen_string_literal: true

require "rails_helper"

RSpec.shared_context "authenticated request" do
  def token(user, _password)
    AuthToken.encode_user(user)
  end

  def build_bearer_token(token)
    "Bearer #{token}"
  end

  def build_headers(token)
    {
      "Authorization" => build_bearer_token(token),
      "content-type" => "application/json"
    }
  end

  def get_user_token(user_type)
    public_send("#{user_type}_auth")
  end

  let_it_be(:password) { "testTest123" }
  let_it_be(:anonymous_headers) { { "content-type" => "application/json" } }

  RoleName.globals.each do |role|
    let_it_be(:"#{role}_email") { "#{role}@castironcoding.com" }
    let_it_be(role.to_sym, refind: true) do
      User.find_by(email: public_send("#{role}_email")) || FactoryBot.create(
        :user,
        role.to_sym,
        email: public_send("#{role}_email"),
        password: password,
        password_confirmation: password,
      )
    end

    let(:"#{role}_token") { token public_send(role), password }
    let(:"#{role}_headers") { build_headers public_send(:"#{role}_token") }
    let(:"#{role}_auth") { build_bearer_token public_send(:"#{role}_token") }
  end

  let(:another_reader_email) { "another-reader@castironcoding.com" }
  let(:another_reader) { FactoryBot.create(:user, :reader, email: another_reader_email, password: password, password_confirmation: password) }
  let(:another_reader_token) { token(another_reader, password) }
  let(:another_reader_headers) { build_headers(another_reader_token) }

  let(:author_email) { "project_author@castironcoding.com" }
  let(:authored_project) { FactoryBot.create :project }
  let(:author) do
    FactoryBot.create(:user, email: author_email, password: password, password_confirmation: password).tap do |author|
      author.add_role :project_author, authored_project
    end
  end
  let(:author_token) { token author, password }
  let(:author_headers) { build_headers author_token }
  let(:author_auth) { build_bearer_token author_headers }
end
