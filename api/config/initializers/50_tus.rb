# frozen_string_literal: true

require "storage/factory"
require "tus/storage/filesystem"

Tus::Server.opts[:storage] = Storage::Factory.tus_server_storage
