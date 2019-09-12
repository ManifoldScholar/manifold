require "rails_helper"

RSpec.shared_context "authenticated request" do

  def token(user, password)
    params = {email: user.email, password: password}
    post api_v1_tokens_path, params: params
    data = JSON.parse(response.body)
    return data.dig("meta", "authToken")
  end

  def build_headers(token)
    {
      "Authorization" => "Bearer #{token}",
      "content-type"=> "application/json"
    }
  end

  let(:author_email) { "author@castironcoding.com" }
  let(:reader_email) { "reader@castironcoding.com" }
  let(:another_reader_email) { "another-reader@castironcoding.com" }
  let(:admin_email) { "admin@castironcoding.com" }
  let(:password) { "testTest123" }
  let(:author) { user = FactoryBot.create(:user, email: author_email, password: password, password_confirmation: password, role: Role::ROLE_PROJECT_AUTHOR) }
  let(:reader) { user = FactoryBot.create(:user, email: reader_email, password: password, password_confirmation: password, role: Role::ROLE_READER) }
  let(:another_reader ) { user = FactoryBot.create(:user, email: another_reader_email, password: password, password_confirmation: password, role: Role::ROLE_READER) }
  let(:admin) { user = FactoryBot.create(:user, email: admin_email, password: password, password_confirmation: password, role: Role::ROLE_ADMIN) }
  let(:author_token) { token(author, password) }
  let(:reader_token) { token(reader, password) }
  let(:another_reader_token) { token(another_reader, password) }
  let(:admin_token) { token(admin, password) }
  let(:admin_headers) { build_headers(admin_token) }
  let(:author_headers) { build_headers(author_token) }
  let(:reader_headers) { build_headers(reader_token) }
  let(:another_reader_headers) { build_headers(another_reader_token) }
  let(:anonymous_headers) { { "content-type" => "application/json" } }

  let(:admin_auth) { "Bearer #{admin_token}" }
  let(:author_auth) { "Bearer #{author_token}" }
  let(:reader_auth) { "Bearer #{reader_token}" }
end
