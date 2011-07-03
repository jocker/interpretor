class ChannelMessage
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :channel

  field :sender
  field :content

  set_callback(:create, :after) do |doc|
    doc.channel.broadcast(:new_message, {:sender => doc.sender, :content => doc.content})
  end

  def self.send
    new(:sender => "aaa", :content => "some content")
  end

end
