require "rails_helper"

# rubocop:disable Metrics/LineLength
RSpec.describe User, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:user)).to be_valid
  end

  it "has many favorites" do
    user = User.new
    2.times { user.favorites.build }
    expect(user.favorites.length).to be 2
  end

  it "reports whether or not a favoritable is among its favorites" do
    user = FactoryBot.create(:user)
    project = FactoryBot.create(:project)
    user.favorite(project)
    expect(user.favorite?(project)).to be true
  end

  it "distinguishes favorite projects from all favorites" do
    user = FactoryBot.create(:user)
    project = FactoryBot.create(:project)
    text = FactoryBot.create(:text)
    user.favorites.create(favoritable: project)
    user.favorites.create(favoritable: text)
    expect(user.favorite_projects.length).to be(1)
  end

  it "should not be valid without a password" do
    user = FactoryBot.build(:user, password: nil, password_confirmation: nil)
    expect(user).to_not be_valid
  end

  it "should be not be valid with a short password" do
    user = FactoryBot.build(:user, password: "short", password_confirmation: "short")
    expect(user).to_not be_valid
  end

  it "should not be valid with a confirmation mismatch" do
    user = FactoryBot.build(:user, password: "short", password_confirmation: "long")
    expect(user).to_not be_valid
  end

  it "should not be valid without email" do
    user = FactoryBot.build(:user, email: nil)
    expect(user).to_not be_valid
  end

  it "should not be valid without first_name" do
    user = FactoryBot.build(:user, first_name: nil)
    expect(user).to_not be_valid
  end

  it "should not be valid without last_name" do
    user = FactoryBot.build(:user, last_name: nil)
    expect(user).to_not be_valid
  end

  it "should not be valid without a role" do
    user = FactoryBot.build(:user, role: nil)
    expect(user).to_not be_valid
  end

  it "should not be valid with an invalid role" do
    user = FactoryBot.build(:user, role: "dog")
    expect(user).to_not be_valid
  end

  it "has a correctly formatted full name" do
    user = FactoryBot.build(:user, name: "John Rambo")
    expect(user.full_name).to eq("John Rambo")
  end

  it "has a default role 'reader'" do
    user = FactoryBot.create(:user)
    expect(user.has_role? :reader).to eq true
  end

  it "sets a role correctly" do
    user = FactoryBot.create(:user, role: Role::ROLE_ADMIN)
    expect(user.has_role? :admin).to eq true
  end

  it "has a case-insensitive email" do
    user = FactoryBot.create(:user, email: "rowan@woof.dog")
    expect(User.find_by(email: "ROWAN@WOOF.DOG")).to eq user
  end

  # TODO: Improve this test
  it "preserves permissions when changing role" do
    user = FactoryBot.create(:user, role: Role::ROLE_EDITOR)
    project = FactoryBot.create(:project)
    user.add_role Role::ROLE_PROJECT_EDITOR, project
    permissions = Array.new user.permissions
    user.role = Role::ROLE_EDITOR
    user.save
    expect(user.reload.permissions).to eq permissions
  end

  context "can be searched", :elasticsearch do

    let(:first) { "189274891457612" }
    let(:last) { "HIOUFHAOASJDFIO" }
    let(:email) { "#{first}@#{last}.com"}

    before(:each) do
      user = FactoryBot.create(:user, first_name: first, last_name: last, email: email)
      User.reindex
      User.searchkick_index.refresh
    end

    it "by first name" do
      results = User.filter({keyword: first, typeahead: true})
      expect(results.length).to be 1
    end

    it "by last name" do
      results = User.filter({keyword: last, typeahead: true})
      expect(results.length).to be 1
    end

    fit "by email" do
      results = User.filter({keyword: email, typeahead: true})
      expect(results.length).to be 1
    end
  end

  context "when resetting password" do

    let(:user) do
      u = FactoryBot.create(:user, password: "password", password_confirmation: "password")
      User.find u.id
    end

    it "generates a reset password token" do
      user.generate_reset_token
      expect(user.reset_password_token).to_not be_nil
    end

    it "expires the reset password token after one hour" do
      user.generate_reset_token
      Timecop.travel(DateTime.now + 1.hour) do
        expect(user.valid_token?).to be false
      end
    end

    it "is valid after 59 minutes have elapsed" do
      user.generate_reset_token
      Timecop.travel(DateTime.now + 59.minutes) do
        expect(user.valid_token?).to be true
      end
    end

    it "can be generated automatically" do
      user.force_reset_password
      expect(user.password).to_not eq("password")
      expect(user.password.length).to eq(12)
      expect(user).to be_valid
    end


  end

  context "already exists" do
    let(:user) do
      u = FactoryBot.create(:user, password: "password", password_confirmation: "password")
      User.find u.id
    end

    it "should be valid with no changes" do
      expect(user).to be_valid
    end

    it "should not be valid with an empty password" do
      user.password = user.password_confirmation = " "
      expect(user).to_not be_valid
    end

    it "should be valid with a new (valid) password" do
      user.password = user.password_confirmation = "new password"
      expect(user).to be_valid
    end

    it "should be able to authenticate" do
      the_user = user
      u = User.find_by(email: the_user.email).try(:authenticate, "password")
      expect(u).to eq(the_user)
    end

    it "should not authenticate if the password is incorrect" do
      u = User.find_by(email: "test@test.com").try(:authenticate, "rambo")
      expect(u).to eq(nil)
    end
  end

  context "when fetching a specially-classified user" do
    shared_examples "unique user classification" do
      let(:classification) { raise "override in inherited contexts" }
      let(:method_name) { raise "override in inherited contexts" }

      it "can create a user that does not already exist" do
        expect do
          User.__send__(method_name)
        end.to change { User.where(classification: classification).count }.from(0).to(1)
      end

      it "exposes a way to tell if a user was created or not" do
        expect do |b|
          User.__send__(method_name, &b)
        end.to yield_with_args(true, a_kind_of(User))

        expect do |b|
          User.__send__(method_name, &b)
        end.to yield_with_args(false, a_kind_of(User))
      end
    end

    context "when fetching the anonymous user" do
      include_examples "unique user classification" do
        let(:classification) { :anonymous }
        let(:method_name) { :anonymous_user }
      end
    end

    context "when fetching the CLI user" do
      include_examples "unique user classification" do
        let(:classification) { :command_line }
        let(:method_name) { :cli_user }
      end
    end
  end
end
