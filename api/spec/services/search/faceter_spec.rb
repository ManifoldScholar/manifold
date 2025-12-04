# frozen_string_literal: true

RSpec.describe Search::Faceter do
  let(:facets) { [] }
  let(:instance) { described_class.new(facets) }

  subject { instance }

  shared_examples_for "no selective project handling" do
    it { is_expected.not_to have_journal_projects_excluded }
    it { is_expected.not_to have_regular_projects_excluded }
    it { is_expected.not_to have_selective_project_handling }
  end

  shared_examples_for "all facets" do
    its(:search_facets) { are_expected.to eq(Search::Types::FACETS) }

    it { is_expected.to be_everything }
    it { is_expected.not_to be_selective }

    it_behaves_like "no selective project handling"
  end

  context "when faceting by nothing" do
    let(:facets) { nil }

    its(:facets) { are_expected.to be_blank }

    it_behaves_like "all facets"
  end

  context "when faceting by everything" do
    let(:facets) { Search::Types::FACETS }

    its(:facets) { are_expected.to match_array(Search::Types::FACETS) }

    it_behaves_like "all facets"
  end

  context "when faceting by everything EXCEPT Journal and Project" do
    let(:facets) { Search::Types::FACETS.without("Journal", "Project") }

    it { is_expected.to be_selective }
    it { is_expected.not_to be_everything }

    it { is_expected.to exclude("Journal") }
    it { is_expected.to exclude("Project") }

    it_behaves_like "no selective project handling"
  end

  context "when faceting by Project and NOT Journal" do
    let(:facets) { Search::Types::FACETS.without("Journal") }

    it { is_expected.to be_selective }
    it { is_expected.not_to be_everything }

    it { is_expected.to have_journal_projects_excluded }
    it { is_expected.not_to have_regular_projects_excluded }

    it { is_expected.to have_selective_project_handling }
    it { is_expected.to exclude("Journal") }
    it { is_expected.to include("Project") }
  end

  context "when faceting by Journal and NOT project" do
    let(:facets) { Search::Types::FACETS.without("Project") }

    its(:facets) { are_expected.to exclude("Project") }

    its(:search_facets) { are_expected.to include("Project") }

    it { is_expected.not_to be_everything }
    it { is_expected.to be_selective }

    it { is_expected.not_to have_journal_projects_excluded }
    it { is_expected.to have_regular_projects_excluded }

    it { is_expected.to have_selective_project_handling }
    it { is_expected.to exclude("Project") }
    it { is_expected.to include("Journal") }
  end
end
