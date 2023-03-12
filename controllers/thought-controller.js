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
.populate("Users")
.populate("friends")
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
Thought.findOneAndDelete({ _id: req.params.ThoughtId })
    .then((Thought) =>
    !Thought
        ? res.status(404).json({ message: 'No Thought with that ID' })
        : User.deleteMany({ _id: { $in: Thought.User } })
    )
    .then(() => res.json({ message: 'Thought and Users deleted!' }))
    .catch((err) => res.status(500).json(err));
},

  // Update a Thought
updateThought(req, res) {
Thought.findOneAndUpdate(
    { _id: req.params.ThoughtId },
    { $set: req.body },
    { runValidators: true, new: true }
)
    .then((Thought) =>
    !Thought
        ? res.status(404).json({ message: 'No Thought with this id!' })
        : res.json(Thought)
    )
    .catch((err) => res.status(500).json(err));
},

 // Add a new Reaction
addReactions({params, body}, res) {
    Thought.findOneAndUpdate({_id: params.thoughtId}, {$push: {reactions: body}}, {new: true, runValidators: true})
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
    .then(dbThoughtsData => {
    if (!dbThoughtsData) {
        res.status(404).json({message: 'No thoughts with this particular ID!'});
        return;
    }
    res.json(dbThoughtsData);
    })
    .catch(err => res.status(400).json(err))

},

// Delete a reaction by ID
deleteReaction({params}, res) {
    Thought.findOneAndUpdate({_id: params.thoughtId}, {$pull: {reactions: {reactionId: params.reactionId}}}, {new : true})
    .then(dbThoughtsData => {
        if (!dbThoughtsData) {
            res.status(404).json({message: 'No thoughts with this particular ID!'});
            return;
        }
        res.json(dbThoughtsData);
    })
    .catch(err => res.status(400).json(err));
}

};


module.exports = ThoughtController;