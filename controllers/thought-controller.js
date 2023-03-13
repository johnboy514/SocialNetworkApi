const { Thought, User } = require('../models');

const ThoughtController = {
  // Get all Thoughts
getThought(req, res) {
Thought.find()
    .then((Thought) => res.json(Thought))
    .catch((err) => res.status(500).json(err));
},

  // Get a Thought
getSingleThought(req, res) {
Thought.findOne({ _id: req.params.thoughtId })
.select('-__v')
.then((Thought) =>
    !Thought
        ? res.status(404).json({ message: 'Where is my mind?!' })
        : res.json(Thought)
    )
    .catch((err) => res.status(500).json(err));
},

createThought(req, res) {
Thought.create(req.body)
    .then(({ _id }) => {
    return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: _id } },
        { new: true }
    );
    })
    .then((thought) =>
    !thought
        ? res.status(404).json({ message: "My mind is empty?!" })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},

  // Delete a Thought
deleteThought(req, res) {
Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then((thought) =>
    !thought
        ? res.status(404).json({ message: 'There are no more thoughts.' })
        : User.deleteMany({ _id: { $in: thought.User } })
    )
    .then(() => res.json({ message: 'My mind has been Removed.' }))
    .catch((err) => res.status(500).json(err));
},

  // Update a Thought
updateThought(req, res) {
Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $set: req.body },
    { runValidators: true, new: true }
)
    .then((thought) =>
    !thought
        ? res.status(404).json({ message: 'My mind is empty of thought?!' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},

 // Add a new Reaction
addReactions(req, res) {
    Thought.findOneAndUpdate({_id: req.params.thoughtId}, {$addToSet: {reactions: req.body}}, {new: true, runValidators: true})
    .then((thought) => 
    !thought 
        ? res.status(404).json({message: 'No thoughts lay here!'})
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},

// Delete a reaction by ID
deleteReaction({params}, res) {
    Thought.findOneAndUpdate({_id: params.thoughtId}, {$pull: {reactions: {reactionId: params.reactionId}}}, {new : true})
    .then((thought) => 
    !thought 
        ? res.status(404).json({message: 'No thoughts lay here!'})
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},

};


module.exports = ThoughtController;