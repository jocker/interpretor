class Channel
  include Mongoid::Document
  include FayeBroadcaster

  field :name, :type => String
  field :subscribers_count, :type => Integer, :default => 0

  referenced_in :owner, :class_name => "User", :inverse_of => :managed_channels, :validate => false
  embeds_many :channel_join_requests
  has_many :channel_messages

  validates_presence_of :name

  def owner
    users = Group.where("users._id" => self.owner_id).first.try(:users) || []
    users.detect { |u| u.id == self.owner_id }
  end



end
