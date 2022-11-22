require "google/cloud/storage"
require "factory/drive_session"

module Storage
  class TusGcs

    # Reasonable multipart upload limits
    MIN_PART_SIZE       = 5 * 1024 * 1024
    MAX_PART_SIZE       = 5 * 1024 * 1024 * 1024 * 1024
    MAX_MULTIPART_PARTS = 32
    MAX_OBJECT_SIZE     = 5 * 1024 * 1024 * 1024 * 1024

    attr_reader :bucket, :prefix, :upload_options, :limits

    # Initializes an aws-sdk-s3 client with the given credentials.
    # rubocop:disable Metrics/ParameterLists
    def initialize(bucket:, prefix: "tus", upload_options: {}, limits: {}, credentials: nil, **_client_options)
      raise ArgumentError, "the :bucket option was nil" unless bucket

      @bucket         = bucket
      @prefix         = prefix
      @upload_options = upload_options
      @limits         = limits
      @storage = nil
      @credentials = credentials
    end
    # rubocop:enable Metrics/ParameterLists

    # Initiates multipart upload for the given upload, and stores its
    # information inside the info hash.
    def create_file(uid, info = {})
      tus_info = Tus::Info.new(info)
      raise Tus::Error, "upload length exceeds maximum object size" if tus_info.length && tus_info.length > max_object_size

      get_bucket.create_file(StringIO.new(""), object_path(uid))
      update_info(uid, info)
    end

    # Concatenates multiple partial uploads into a single upload, and returns
    # the size of the resulting upload. The partial uploads are deleted after
    # concatenation.
    def concatenate(uid, part_uids, _info = {})
      get_bucket.compose(object_paths(part_uids), object_path(uid))
      delete_uids(part_uids)
    rescue Google::Cloud::NotFoundError
      raise Tus::Error
    end

    # Appends data to the specified upload in a streaming fashion, and returns
    # the number of bytes it managed to save.
    def patch_file(uid, io, _info = {})
      stream = io.respond_to?(:get_input) ? io.get_input : io
      if get_object(uid)
        orig = "#{uid}-orig"
        patched = "#{uid}-patched"
        get_object(uid).rewrite object_path(orig)
        get_bucket.create_file(stream, object_path(patched))
        concatenate(uid, [orig, patched])
      else
        get_bucket.create_file(stream, object_path(uid))
      end
      stream.length
    end

    def update_info(uid, info)
      get_bucket.create_file(StringIO.new(JSON.generate(info)), info_path(uid))
    end

    def read_info(uid)
      response = get_info_object(uid)&.download
      raise Tus::NotFound unless response

      response.rewind
      JSON.parse(response.read)
    end

    # Returns a Tus::Response object through which data of the specified
    # upload can be retrieved in a streaming fashion. Accepts an optional
    # range parameter for selecting a subset of bytes to retrieve.
    def get_file(uid, _info = {}, range: nil)
      range_opts = range ? range.begin..range.end : nil
      data = get_object(uid).download(range: range_opts)
      data.rewind
      remaining_length = data.length
      chunks = Enumerator.new do |yielder|
        while remaining_length.positive?
          chunk = data.read([16 * 1024, remaining_length].min) or break
          remaining_length -= chunk.bytesize
          yielder << chunk
        end
      end

      Tus::Response.new(chunks: chunks, close: data.method(:close))
    end

    # optional
    def file_url(uid, info = {}, **options); end

    def delete_file(uid, _info = {})
      get_object(uid)&.delete
      get_info_object(uid)&.delete
    end

    def expire_files(expiration_date); end

    def exists?(uid)
      !!get_object(uid)
    end

    def info_exists?(uid)
      !!get_info_object(uid)
    end

    def min_part_size
      limits.fetch(:min_part_size,       MIN_PART_SIZE)
    end

    def max_part_size
      limits.fetch(:max_part_size,       MAX_PART_SIZE)
    end

    def max_multipart_parts
      limits.fetch(:max_multipart_parts, MAX_MULTIPART_PARTS)
    end

    def max_object_size
      limits.fetch(:max_object_size,     MAX_OBJECT_SIZE)
    end

    private

    def delete_uids(uids)
      uids.each do |uid|
        get_object(uid)&.delete
        get_info_object(uid)&.delete
      end
    end

    def object_paths(uids)
      uids.map { |uid| object_path(uid) }
    end

    def get_info(uid); end

    def get_object(uid)
      get_bucket.file(object_path(uid))
    end

    def get_info_object(uid)
      get_bucket.file(info_path(uid))
    end

    def get_bucket(bucket_name = @bucket)
      storage.bucket(bucket_name, skip_lookup: true)
    end

    def object_path(uid)
      [*prefix, uid].join("/")
    end

    def info_path(uid)
      [*prefix, "#{uid}.info"].join("/")
    end

    def storage
      return @storage if @storage

      opts = {}
      opts[:project] = @project if @project
      opts[:credentials] = @credentials if @credentials

      @storage = Google::Cloud::Storage.new(opts)
    end

  end
end
