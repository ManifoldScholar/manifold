module API
  module V1
    # subjects controller
    class SubjectsController < ApplicationController

      resourceful! Subject, authorize_options: { except: [:index, :show] } do
        Subject.filtered(filter_options)
      end

      def index
        @subjects = load_subjects.with_order
        render_multiple_resources(
          @subjects
        )
      end

      def show
        @subject = load_subject
        render_single_resource(@subject)
      end

      def create
        @subject = authorize_and_create_subject(subject_params)
        render_single_resource @subject
      end

      def update
        @subject = load_and_authorize_subject
        ::Updaters::Default.new(subject_params).update(@subject)
        render_single_resource(@subject)
      end

      def destroy
        @subject = load_and_authorize_subject
        @subject.destroy
      end

      private

      def filter_options
        return subject_filter_params if params&.dig(:unpaginated)

        with_pagination!(subject_filter_params)
      end

    end
  end
end
