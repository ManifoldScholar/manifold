# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::ContextRole do
  def instructor?(roles)
    described_class.new(roles).instructor?
  end

  def role_uri(path)
    "http://purl.imsglobal.org/vocab/lis/v2/#{path}"
  end

  it "recognizes the bare, core, and sub-role context Instructor forms" do
    expect(instructor?(["Instructor"])).to be(true)
    expect(instructor?([role_uri("membership#Instructor")])).to be(true)
    expect(instructor?([role_uri("membership/Instructor#TeachingAssistant")])).to be(true)
    expect(instructor?([role_uri("membership/Instructor#PrimaryInstructor")])).to be(true)
  end

  it "detects Instructor among a mix of roles" do
    expect(instructor?([role_uri("system/person#Administrator"), role_uri("membership#Instructor")])).to be(true)
  end

  it "is false for non-Instructor context roles" do
    expect(instructor?([role_uri("membership#Learner")])).to be(false)
    expect(instructor?([role_uri("membership#ContentDeveloper")])).to be(false)
    expect(instructor?(["Learner"])).to be(false)
  end

  it "ignores institution and system roles, including institution Instructor" do
    expect(instructor?([role_uri("institution/person#Instructor")])).to be(false)
    expect(instructor?([role_uri("system/person#Administrator")])).to be(false)
  end

  it "is false for empty or nil roles" do
    expect(instructor?([])).to be(false)
    expect(instructor?(nil)).to be(false)
  end
end
