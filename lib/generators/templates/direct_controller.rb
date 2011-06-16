class <%= class_name %>Controller < DirectController

<% for action in actions -%>
  def <%= action %>

  end

<% end -%>
end