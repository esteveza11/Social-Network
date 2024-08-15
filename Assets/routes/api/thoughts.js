const router = require('express').Router();
const Thought = require('../../models/Thought');
const User = require('../../models/User');

// GET all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find().populate('reactions');
        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a single thought by ID
router.get('/:thoughtId', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId).populate('reactions');
        if (!thought) return res.status(404).json({ message: 'Thought not found' });
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST a new thought
router.post('/', async (req, res) => {
    try {
        const thought = await Thought.create(req.body);
        // Also add thought's ID to the associated user's thoughts array
        await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: thought._id } });
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
});

// PUT to update a thought by ID
router.put('/:thoughtId', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
        if (!thought) return res.status(404).json({ message: 'Thought not found' });
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE a thought by ID
router.delete('/:thoughtId', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
        if (!thought) return res.status(404).json({ message: 'Thought not found' });

        // Also remove thought's ID from the associated user's thoughts array
        await User.updateMany({ thoughts: thought._id }, { $pull: { thoughts: thought._id } });
        res.json({ message: 'Thought deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST a reaction
router.post('/:thoughtId/reactions', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $push: { reactions: req.body } },
            { new: true }
        );
        if (!thought) return res.status(404).json({ message: 'Thought not found' });
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE a reaction
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );
        if (!thought) return res.status(404).json({ message: 'Thought not found' });
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
