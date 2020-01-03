require "rails_helper"

RSpec.shared_context "authenticated request" do
  def token(user, password)
    params = { email: user.email, password: password }
    post api_v1_tokens_path, params: params
    data = JSON.parse(response.body)
    data.dig("meta", "authToken")
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
    eval("#{user_type}_auth")
  end


  let(:password) { "testTest123" }
  let(:anonymous_headers) { { "content-type" => "application/json" } }

  Role::ALLOWED_ROLES.each do |role|
    let("#{role}_email".to_sym) { "#{role}@castironcoding.com"}
    let(role.to_sym) {
      FactoryBot.create(
        :user,
        email: eval("#{role}_email"),
        password: password,
        password_confirmation: password,
        role: role
      )
    }
    let("#{role}_token".to_sym)   { token(eval(role), password) }
    let("#{role}_headers".to_sym) { build_headers(eval("#{role}_token")) }
    let("#{role}_auth".to_sym)    { build_bearer_token(eval("#{role}_token")) }
  end

  let(:another_reader_email) { "another-reader@castironcoding.com" }
  let(:another_reader) { FactoryBot.create(:user, email: another_reader_email, password: password, password_confirmation: password, role: Role::ROLE_READER) }
  let(:another_reader_token) { token(another_reader, password) }
  let(:another_reader_headers) { build_headers(another_reader_token) }

  let(:author_email) { project_author_email }
  let(:author) { project_author }
  let(:author_headers) { project_author_headers }
  let(:author_auth) { project_author_auth }
end
