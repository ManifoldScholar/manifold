# This class is used in place of the GoogleDrive gem's list class, which provides an
# enumerable interface to Google worksheets. The reason we override it is because our
# current implementation assumes that the data in the worksheet begins on row 4, and that
# the column headers begin on row 2. This is per the structure laid out by the University
# of Minnesota press.
# rubocop:disable Style/For
module Importer
  module Helpers
    class List
      include(Enumerable)

      # @api private
      def initialize(worksheet)
        @worksheet = worksheet
      end

      # Number of non-empty rows in the worksheet excluding the three rows.
      def size
        @worksheet.num_rows - 3
      end

      # Returns Hash-like object (GoogleDrive::ListRow) for the row with the
      # index. Keys of the object are colum names (the first row).
      # The second row has index 0.
      #
      # Note that updates to the returned object are not sent to the server until
      # you call GoogleDrive::Worksheet#save().
      def [](index)
        GoogleDrive::ListRow.new(self, index)
      end

      # Updates the row with the index with the given Hash object.
      # Keys of +hash+ are colum names (the first row).
      # The second row has index 0.
      #
      # Note that update is not sent to the server until
      # you call GoogleDrive::Worksheet#save().
      def []=(index, hash)
        self[index].replace(hash)
      end

      # Iterates over Hash-like object (GoogleDrive::ListRow) for each row
      # (except for the first row).
      # Keys of the object are colum names (the first row).
      def each(&_block)
        for i in 0...size
          yield(self[i])
        end
      end

      # Column names i.e. the contents of the first row.
      # Duplicates are removed.
      def keys
        (1..@worksheet.num_cols).map { |i| @worksheet[2, i] }.uniq
      end

      # Updates column names i.e. the contents of the first row.
      #
      # Note that update is not sent to the server until
      # you call GoogleDrive::Worksheet#save().
      def keys=(ary)
        for i in 1..ary.size
          @worksheet[2, i] = ary[i - 1]
        end
        for i in (ary.size + 1)..@worksheet.num_cols
          @worksheet[2, i] = ""
        end
      end

      # Adds a new row to the bottom.
      # Keys of +hash+ are colum names (the first row).
      # Returns GoogleDrive::ListRow for the new row.
      #
      # Note that update is not sent to the server until
      # you call GoogleDrive::Worksheet#save().
      def push(hash)
        row = self[size]
        row.update(hash)
        row
      end

      # Returns all rows (except for the first row) as Array of Hash.
      # Keys of Hash objects are colum names (the first row).
      def to_hash_array
        map(&:to_hash)
      end

      # @api private
      def get(index, key)
        @worksheet[index + 4, key_to_col(key)]
      end

      # @api private
      def numeric_value(index, key)
        @worksheet.numeric_value(index + 4, key_to_col(key))
      end

      # @api private
      def input_value(index, key)
        @worksheet.input_value(index + 4, key_to_col(key))
      end

      # @api private
      def set(index, key, value)
        @worksheet[index + 2, key_to_col(key)] = value
      end

      private

      def key_to_col(key)
        key = key.to_s
        col = (1..@worksheet.num_cols).find { |c| @worksheet[2, c] == key }
        raise(GoogleDrive::Error, "Column doesn't exist: %p" % key) unless col

        col
      end
    end
  end
end
# rubocop:enable Style/For
