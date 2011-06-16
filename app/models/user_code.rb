class UserCode
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mixins::Models::CodeModule

  embedded_in :user

  set_callback(:create, :after) do |doc|
    doc.code_language.inc(:uses_count, 1)
  end

  set_callback(:destroy, :after) do |doc|
    doc.code_language.inc(:uses_count, -1)
  end

end
