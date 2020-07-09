require "rails_helper"

RSpec.describe Entitlements::Create, interaction: true do
  let(:subscriber) { false }
  let(:read_access) { false }
  let(:entitled_subject) { FactoryBot.create :project }

  let!(:target_user) { FactoryBot.create :user }

  let_input!(:subject_url) { entitled_subject.to_entitlement_gid.to_s }
  let_input!(:entitling_entity) { FactoryBot.create :user }
  let_input!(:global_roles) { { subscriber: subscriber } }
  let_input!(:scoped_roles) { { read_access: read_access } }
  let_input!(:target_url) { target_user.to_gid.to_s }

  context "for a project" do
    context "when providing read_access" do
      let(:read_access) { true }

      it "creates an entitlement" do
        perform_within_expectation! do |e|
          e.to change(Entitlement, :count).and change { target_user.reload.has_role?(:read_access, entitled_subject) }
        end
      end
    end

    context "with no scoped roles specified" do
      it "fails" do
        perform_within_expectation! valid: false do |e|
          e.to keep_the_same(Entitlement, :count)
        end
        expect(@outcome).to have(1).error_on :scoped_roles
      end
    end

    context "when providing an expiration" do
      let(:read_access) { true }

      def expect_expiration_on(date)
        perform_within_expectation!

        expect(@outcome.result.expires_on).to eq date.to_date
      end

      shared_examples_for "a failed expiration" do
        it "fails" do
          perform_within_expectation! valid: false do |e|
            e.to keep_the_same(Entitlement, :count)
          end

          expect(@outcome).to have(1).error_on :expiration
        end
      end

      context "with a YYYY/MM/DD date" do
        let(:expected_value) { 2.years.from_now.to_date }

        let_input!(:expiration) { expected_value.strftime("%Y/%m/%d") }

        it "produces the right expiration" do
          expect_expiration_on(expected_value)
        end
      end

      context "with a MM/DD/YYYY date" do
        let(:expected_value) { 2.years.from_now.to_date }

        let_input!(:expiration) { expected_value.strftime("%m/%d/%Y") }

        it "produces the right expiration" do
          expect_expiration_on(expected_value)
        end
      end

      context "that is fuzzy" do
        let_input!(:expiration) { "in 1 year" }

        it "produces the right expiration" do
          expect_expiration_on(1.year.from_now)
        end
      end

      context "with an invalid date" do
        let_input!(:expiration) { "Invalid Date Breaks The Bank" }

        include_examples "a failed expiration"
      end

      context "with a date in the past" do
        let_input!(:expiration) { "1999/12/13" }

        include_examples "a failed expiration"
      end

      context "that is ambiguous" do
        let_input!(:expiration) { "2 years" }

        include_examples "a failed expiration"
      end
    end
  end

  context "for a project collection" do
    let(:entitled_subject) { FactoryBot.create :project_collection }

    context "when providing read_access" do
      let(:read_access) { true }

      it "creates an entitlement" do
        perform_within_expectation! do |e|
          e.to change(Entitlement, :count).and change { target_user.reload.has_role?(:read_access, entitled_subject) }
        end
      end
    end

    context "with no scoped roles specified" do
      it "fails" do
        perform_within_expectation! valid: false do |e|
          e.to keep_the_same(Entitlement, :count)
        end

        expect(@outcome).to have(1).error_on :scoped_roles
      end
    end
  end

  context "for a global subscriber" do
    let(:entitled_subject) { FactoryBot.create :system_entitlement, :subscription }

    context "when subscribing the user" do
      let(:subscriber) { true }

      it "creates an entitlement" do
        perform_within_expectation! do |e|
          e.to change(Entitlement, :count).and change { target_user.reload.has_role?(:subscriber, entitled_subject) }
        end
      end
    end

    context "with no global roles specified" do
      it "fails" do
        perform_within_expectation! valid: false do |e|
          e.to keep_the_same(Entitlement, :count)
        end

        expect(@outcome).to have(1).error_on :global_roles
      end
    end
  end
end
