# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "Feature Abilities", :authorizer do
  context 'when the subject is an admin' do
    subject { FactoryBot.create(:user, :admin) }

    the_subject_behaves_like "class abilities", Feature, all: true
  end

  context 'when the subject is an editor' do
    subject { FactoryBot.create(:user, :editor) }

    the_subject_behaves_like "class abilities", Feature, all: true
  end

  context 'when the subject is a marketeer' do
    subject { FactoryBot.create(:user, :marketeer) }

    the_subject_behaves_like "class abilities", Feature, all: true
  end

  context 'when the subject is a reader' do
    subject { FactoryBot.create(:user) }

    the_subject_behaves_like "class abilities", Feature, read_only: true
  end
end
