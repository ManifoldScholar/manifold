require 'rails_helper'

RSpec.describe "Stylesheet Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, :admin) }

    the_subject_behaves_like "class abilities", Stylesheet, all: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    the_subject_behaves_like "class abilities", Stylesheet, all: true
  end

  context "when the subject is a reader and project_editor of the stylesheet's project" do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @text = FactoryBot.create(:text)
      @stylesheet = FactoryBot.create(:stylesheet, text: @text)
      @maintainer.add_role :project_editor, @text.project
    end
    let(:subject) { @maintainer }
    let(:object) { @stylesheet }

    the_subject_behaves_like "instance abilities", Resource, all: true
  end

  context "when the subject is a reader with no relation to the stylesheet's project" do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @text = FactoryBot.create(:text)
      @stylesheet = FactoryBot.create(:stylesheet, text: @text)
    end
    let(:subject) { @maintainer }
    let(:object) { @stylesheet }

    the_subject_behaves_like "instance abilities", Resource, read_only: true
  end
end
