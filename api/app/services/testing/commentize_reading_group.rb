module Testing
  class CommentizeReadingGroup < ActiveInteraction::Base
    record :reading_group

    integer :top_level_comment_count, default: proc { 20 }
    integer :subcomment_min, default: proc { 0 }
    integer :subcomment_max, default: proc { 7 }
    integer :comment_depth, default: proc { 2 }

    def execute
      @users = reading_group.users.to_a.cycle
      @annotations = reading_group.annotations.sample(top_level_comment_count).to_a.cycle

      top_level_comment_count.times do
        generate_top_level_comment!
      end
    end

    private

    def generate_top_level_comment!
      @annotation = @annotations.next

      create_comment!
    ensure
      @annotation = nil
    end

    def create_comment!(depth: 0, parent: nil)
      comment = Comment.create!(
        creator: @users.next,
        subject: @annotation,
        body: Faker::Lorem.paragraph,
        parent: parent
      )

      if depth < comment_depth
        subcomment_count = SecureRandom.random_number(subcomment_min..subcomment_max)

        subcomment_count.times do
          create_comment! parent: comment, depth: depth + 1
        end
      end

      return comment
    end
  end
end
