require 'rails_helper'

RSpec.describe "Event Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
    let(:object) { FactoryBot.create(:event) }

    the_subject_behaves_like "instance abilities", Event, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:object) { FactoryBot.create(:event) }

    the_subject_behaves_like "instance abilities", Event, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }
    let(:object) { FactoryBot.create(:event) }

    the_subject_behaves_like "instance abilities", Event, read_only: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }
    let(:object) { FactoryBot.create(:event) }

    the_subject_behaves_like "instance abilities", Event, all: true
  end

  context 'when the subject is a reader and project_editor of the event\'s project' do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @event = FactoryBot.create(:event)
      @maintainer.add_role Role::ROLE_PROJECT_EDITOR, @event.project
    end
    let(:subject) { @maintainer }
    let(:object) { @event }

    the_subject_behaves_like "instance abilities", Event, all: true
  end

  context 'when the subject is a reader and project_resource_editor of the event\'s project' do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      @event = FactoryBot.create(:event)
      @metadata_maintainer.add_role Role::ROLE_PROJECT_RESOURCE_EDITOR, @event.project
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @event }

    the_subject_behaves_like "instance abilities", Event, read_only: true
  end

  context 'when the subject is a reader and project_author of the event\'s project' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @event = FactoryBot.create(:event)
      @author.add_role Role::ROLE_PROJECT_AUTHOR, @event.project
    end
    let(:subject) { @author }
    let(:object) { @event }

    the_subject_behaves_like "instance abilities", Event, read_only: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:event) }

    the_subject_behaves_like "instance abilities", Event, read_only: true
  end
end
