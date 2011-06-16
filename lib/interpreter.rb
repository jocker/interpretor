require "net/ssh"
require "net/scp"

module Interpreter

  class Base
    MAX_EXECUTION_TIME = 0.5
    FILES_PATH = "IO_FILES"

    attr_reader :result, :error, :code

    def initialize(code)
      @code = code
      @executed = false
      @result, @error = "",""
    end

    def succeeded?
      @executed && @error.blank?
    end

    def compile

      args = [ APP_CONFIG[:ssh][:host], APP_CONFIG[:ssh][:username], {:password => APP_CONFIG[:ssh][:password]} ]
      begin
        Timeout::timeout(5) do
          Net::SCP.start( *args ) do|scp|
            Net::SSH.start( *args ) do|ssh|
              scp.upload!( StringIO.new(code), self.input_filename )
              scp.upload!( StringIO.new(sh_command), self.sh_filename )

              ssh.exec!("chmod +x #{self.sh_filename}")
              ssh.exec!( self.sh_filename )

              @result =  parse_result scp.download!( self.output_filename )
              @error = parse_error scp.download!( self.error_filename )
              ssh.exec!("rm #{FILES_PATH}/#{pid}*")
              @executed = true


            end
          end
        end
      rescue Timeout::Error
        @error = "Execution expired"
      rescue
        @error = "Something wrong happened"
      end

      self
    end

    protected


    def pid
      @pid ||= BSON::ObjectId.new.to_s
    end

    def command_prefix
      self.class.name.downcase.gsub(/(.+\:\:)+/,"")
    end

    ["input","output","error","sh"].each do |name|
      class_eval <<METHOD
def #{name}_filename
  "#{FILES_PATH}/"+pid+"#{name}"
end
METHOD
    end


    def command_arguments
      "#{self.input_filename} 1> #{self.output_filename} 2> #{self.error_filename} &"
    end


    def sh_command
      <<TEXT
      #!/bin/bash

      # here you set the time you want to wait before killing the process
      time=#{MAX_EXECUTION_TIME}s

      # then you run your program in the background
      #{command_prefix} #{command_arguments}
      # you are waiting for the time you have set
      sleep $time

      # and now you are about to kill it
      kill %1
TEXT
    end

    def parse_error(str)
      title = "<span style='color:#ff0000'>Error message</span> #{ str.length > 1000 ? "too long(trimmed to 1000 characters)" : "" }"
      str.blank? ? "" : "<h1 style='border-bottom:1px solid #ff0000; margin-bottom:10px;'>#{title}</h1>#{ str.gsub(/\/home\/chris\//,"").gsub(FILES_PATH,"").gsub(/\n/,"<br />")[0..1000] }"
    end

    def parse_result(str)
      title = "<span style='color:#1e831e'>Success message</span> #{ str.length > 1000 ? "too long(trimmed to 1000 characters)" : "" }"
      str.blank? ? "" : "<h1 style='border-bottom:1px solid #1e831e; margin-bottom:10px;'>#{title}</h1>#{ str.gsub(/\/home\/chris\//,"").gsub(FILES_PATH,"").gsub(/\n/,"<br />")[0..1000] }"
    end

  end


  class Ruby < Base; end
  class Python < Base; end
  class Node < Base; end
  class Java < Base; end
  class Mono < Base; end
  class Php < Base; end

  class CPlus < Base

    protected
    def command_prefix
      "g++"
    end

  end



end