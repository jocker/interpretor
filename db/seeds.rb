Mongoid.master.collections.reject { |c| c.name =~ /(^system\.)|(^clients$)/ }.each(&:drop)
group = Group.new(:name => "demo", :subdomain => "demo")

admin = group.users.new(:email => "admin@interpretor.ro", :password => "demo")
user = group.users.new(:email => "user@interpretor.ro", :password => "demo")

admin.superuser = true

group.save

["Ruby","NodeJs","Python"].each do |name|
  c = Channel.create(:name => name)
  admin.managed_channels << c
  c.save
end
group.save

admin.managed_channels.each do |channel|
  user.send_channel_join_request channel
end







CodeLanguage.create(:key => "ruby",:name => "Ruby", :icon => "icon_ruby", :class_name => "Ruby")
CodeLanguage.create(:key => "cplus", :name => "C++", :icon => "icon_cplus", :class_name => "CPlus")
CodeLanguage.create(:key => "mono", :name => "C#", :icon => "icon_csharp", :class_name => "Mono")
CodeLanguage.create(:key => "python", :name => "Python", :icon => "icon_python", :class_name => "Python")
CodeLanguage.create(:key => "php", :name => "Php", :icon => "icon_php", :class_name => "Php")
CodeLanguage.create(:key => "java", :name => "Java", :icon => "icon_java", :class_name => "Java")
CodeLanguage.create(:key => "node", :name => "Node js", :icon => "icon_node", :class_name => "Node")
CodeLanguage.create(:key => "perl", :name => "Perl", :icon => "icon_perl", :class_name => "Perl")

CodeLanguage.all.each do |language|
  SampleCode.create(:name => "Sample #{language.name} code", :content => "Sample #{language.name} code", :code_language => language)
  admin.user_codes.create(:name => "User #{language.name} code", :content => "User #{language.name} code", :code_language => language)
end

