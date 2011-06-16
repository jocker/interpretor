# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "action_direct/version"

Gem::Specification.new do |s|
  s.name        = "action_direct"
  s.version     = ActionDirect::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Cristian Slabu"]
  s.homepage    = ""
  s.summary     = %q{ExtJs direct integration}
  s.description = %q{ExtJs direct integration}

  s.rubyforge_project = "action_direct"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
end
