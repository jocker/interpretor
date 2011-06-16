class Channel
  include Mongoid::Document

  field :name, :type => String

  referenced_in :owner, :class_name => "User", :inverse_of => :managed_channels, :validate => false
  embeds_many :channel_join_requests

  validates_presence_of :name

  def owner
    users = Group.where("users._id" => self.owner_id).first.try(:users) || []
    users.detect { |u| u.id == self.owner_id }
  end

end
