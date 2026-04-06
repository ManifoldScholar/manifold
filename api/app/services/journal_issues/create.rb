# frozen_string_literal: true

module JournalIssues
  class Create < ActiveInteraction::Base
    isolatable!

    transactional!

    record :creator, class: "User"
    record :journal

    # Params are filtered in strong parameters with journal_issue_params
    hash :params, strip: false

    attr_reader :journal_issue

    # @return [JournalIssue]
    def execute
      @journal_issue = journal.journal_issues.new(creator: creator)

      ::Updaters::Default.new(params).update(@journal_issue)

      create_and_assign_project unless @journal_issue.project.present?

      journal_issue.save

      return journal_issue
    end

    private

    def create_and_assign_project
      title_parts = [journal.title]
      title_parts.push "vol. #{journal_issue.journal_volume_number}" if journal_issue.journal_volume.present?
      title_parts.push "no. #{journal_issue.number}"

      project = Project.create(title: title_parts.join(", "), creator: creator)

      inputs = { project: project, configuration: { multiple_texts: true } }

      compose Content::ScaffoldProjectContent, inputs

      @journal_issue.project = project
    end
  end
end
