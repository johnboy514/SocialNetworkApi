const router = require('express').Router();
const {
  getThought,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReactions,
  deleteReaction
} = require('../../controllers/thought-controller.js');

router.route('/').get(getThought);
router.route('/thought:id').get(getSingleThought).put(updateThought).delete(deleteThought);
router.route('/').post(createThought);
router.route('/:thoughtId/reactions').post(addReactions);
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;
