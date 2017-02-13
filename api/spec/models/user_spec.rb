require "rails_helper"

# rubocop:disable Metrics/LineLength
RSpec.describe User, type: :model do
  it "has a valid factory" do
    expect(FactoryGirl.build(:user)).to be_valid
  end

  it "has many favorites" do
    user = User.new
    2.times { user.favorites.build }
    expect(user.favorites.length).to be 2
  end

  it "reports whether or not a favoritable is among its favorites" do
    user = FactoryGirl.create(:user)
    project = FactoryGirl.create(:project)
    user.favorite(project)
    expect(user.favorite?(project)).to be true
  end

  it "distinguishes favorite projects from all favorites" do
    user = FactoryGirl.create(:user)
    project = FactoryGirl.create(:project)
    text = FactoryGirl.create(:text)
    user.favorites.create(favoritable: project)
    user.favorites.create(favoritable: text)
    expect(user.favorite_projects.length).to be(1)
  end

  it "should not be valid without a password" do
    user = FactoryGirl.build(:user, password: nil, password_confirmation: nil)
    expect(user).to_not be_valid
  end

  it "should be not be valid with a short password" do
    user = FactoryGirl.build(:user, password: "short", password_confirmation: "short")
    expect(user).to_not be_valid
  end

  it "should not be valid with a confirmation mismatch" do
    user = FactoryGirl.build(:user, password: "short", password_confirmation: "long")
    expect(user).to_not be_valid
  end

  it "should not be valid without email" do
    user = FactoryGirl.build(:user, email: nil)
    expect(user).to_not be_valid
  end

  it "should not be valid without first_name" do
    user = FactoryGirl.build(:user, first_name: nil)
    expect(user).to_not be_valid
  end

  it "should not be valid without last_name" do
    user = FactoryGirl.build(:user, last_name: nil)
    expect(user).to_not be_valid
  end

  it "should split split name and assign to first and last name" do
    user = FactoryGirl.build(:user, name: "John Rambo")
    expect(user.first_name).to eq("John")
    expect(user.last_name).to eq("Rambo")
  end

  it "returns the user's name" do
    user = FactoryGirl.build(:user, name: "John Rambo")
    expect(user.name).to eq("John Rambo")
  end

  it "has a collection of associated makers" do
    user = FactoryGirl.create(:user)
    2.times { user.makers << FactoryGirl.create(:maker) }
    expect(user.makers.count).to eq(2)
  end

  context "can be searched", :integration, :elasticsearch do

    let(:first) { "189274891457612" }
    let(:last) { "HIOUFHAOASJDFIO" }
    let(:email) { "#{first}@#{last}.com"}

    before(:each) do
      user = FactoryGirl.create(:user, first_name: first, last_name: last, email: email)
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

    it "by email" do
      results = User.filter({keyword: email, typeahead: true})
      expect(results.length).to be 1
    end

  end

  context "already exists" do
    let(:user) do
      u = FactoryGirl.create(:user, password: "password", password_confirmation: "password")
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
end
