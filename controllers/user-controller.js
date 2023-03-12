const { User, Thought } = require('../models');

const userController = {
  // Get all Users
getUser(req, res) {
User.find()
    .then((User) => res.json(User))
    .catch((err) => res.status(500).json(err));
},

  // Get a User
getSingleUser(req, res) {
User.findOne({ _id: req.params.id })
.populate("thoughts")
.populate("friends")
.select('-__v')
.then((User) =>
    !User
        ? res.status(404).json({ message: 'No User with that ID' })
        : res.json(User)
    )
    .catch((err) => res.status(500).json(err));
},

  // Create a User
createUser(req, res) {
User.create(req.body)
    .then((User) => res.json(User))
    .catch((err) => {
    console.log(err);
    return res.status(500).json(err);
    });
},

  // Delete a User
deleteUser(req, res) {
User.findOneAndDelete({ _id: req.params.id })
    .then((User) =>
    !User
        ? res.status(404).json({ message: 'No User with that ID' })
        : Thought.deleteMany({ _id: { $in: User.Thought } })
    )
    .then(() => res.json({ message: 'User and Thoughts deleted!' }))
    .catch((err) => res.status(500).json(err));
},

  // Update a User
updateUser(req, res) {
User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { runValidators: true, new: true }
)
    .then((User) =>
    !User
        ? res.status(404).json({ message: 'No User with this id!' })
        : res.json(User)
    )
    .catch((err) => res.status(500).json(err));
},

  // Add friend to friend list
addFriend(req, res) {
User.findOneAndUpdate(
    { _id: req.params.id },
    { $addToSet: { friends: req.params.friendId } },
    { new: true }
)
    .then((User) => {
    if (!User) {
        return res.status(404).json({ message: "No user with this id!" });
    }
    res.json(User);
    })
    .catch((err) => {
    console.log(err);
    res.status(500).json(err);
    });
},

  // Remove friend from friend list
deleteFriend(req, res) {
User.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { friends: req.params.friendId } },
    { new: true }
)
    .then((User) => {
    if (!User) {
        return res.status(404).json({ message: "No user with this id!" });
    }
    res.json(User);
    })
    .catch((err) => {
    console.log(err);
    res.status(500).json(err);
    });
}};

module.exports = userController;
