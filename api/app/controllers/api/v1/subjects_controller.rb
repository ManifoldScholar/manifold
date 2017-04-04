module Api
  module V1
    # subjects controller
    class SubjectsController < ApplicationController

      resourceful! Subject, authorize_options: { except: [:index, :show] } do
        Subject.filter(with_pagination!(subject_filter_params))
      end

      def index
        @subjects = load_subjects
        render_multiple_resources(
          @subjects,
          each_serializer: SubjectSerializer
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
        @subject.destroy
      end

    end
  end
end
