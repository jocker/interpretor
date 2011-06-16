module ActionDirect
  module Config

    mattr_reader :endpoints
    @@endpoints = []

    class << self

      def register_endpoint(*args)
        options = args.extract_options!.to_options.merge({path: args.shift.to_s, namespace: args.shift.to_s})

        raise "endpoint already defined for this path" if @@endpoints.any?{|item| item[:path] == options[:path] }

        @@endpoints << options

        self
      end


    end

  end

  autoload :Request, "action_direct/request"
  autoload :Router, "action_direct/router"
  autoload :Responder, "action_direct/responder"

  def self.setup
    yield Config
  end
end

require "action_direct/railtie"