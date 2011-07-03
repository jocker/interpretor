class Message
  include Mongoid::Document
  include Mongoid::Timestamps

  field :from, :type => BSON::ObjectId
  field :to, :type => BSON::ObjectId
  field :viewed, :type => Boolean, :default => false

  field :from_name
  field :to_name

  field :content
  field :subject

  validates_presence_of :subject, :content

  set_callback(:create, :after) do |doc|
    get_user(:to).broadcast(:new_message, {:subject => doc.subject, :from => doc.from_name})
  end

  def self.send
    u = Group.first.users.first
    m = new({:subject => "message subject", :content => "message content"})
    m.from = u
    m.to = u
    m.save
  end

  def from=(value)
    set_user(value, :from)
  end

  def to=(value)
    set_user(value, :to)
  end

  def broadcast(name, data={})
    FayeBroadcaster.deliver_message("/#{id}",data.merge({:command => name}))
  end

  def get_user(sym=:to)
    user_id = send sym
    Group.where("users._id" => user_id).first.users.detect{|u| u.id == user_id}
  end

  private

  def set_user(user, field)
    if user.is_a?(User)
      write_attribute("#{field}_name", user.email)
      write_attribute(field, user.id)
    else
      write_attribute(field, user)
    end
  end

end
