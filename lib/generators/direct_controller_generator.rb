require "rails/generators/named_base"

class DirectControllerGenerator < Rails::Generators::NamedBase

  check_class_collision :suffix => "Controller"
  argument :actions, :type => :array, :default => [], :banner => "action action"

  def source_paths
    [] << File.expand_path(File.join(File.dirname(__FILE__), 'templates'))
  end

  def create_controller_file
    template 'direct_controller.rb', File.join('app/controllers', class_path, "#{file_name}_controller.rb")
  end

  def add_routes
    route %{match "/#{file_name}/:action", :to => "#{file_name}#:action" }
  end

  hook_for :test_framework

end