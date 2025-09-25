import { Router } from 'express';
import Progress from '../models/Progress.js';
import Problem from '../models/Problem.js';
import Topic from '../models/Topic.js';
import mongoose from 'mongoose';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// Toggle or set progress for a problem
router.post('/set', authRequired, async (req, res) => {
  try {
    const { problemId, completed } = req.body;
    if (!problemId || typeof completed === 'undefined') {
      return res.status(400).json({ message: 'problemId and completed required' });
    }
    const doc = await Progress.findOneAndUpdate(
      { user: req.user.id, problem: problemId },
      { completed, lastViewedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json({ id: doc._id, problem: doc.problem, completed: doc.completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get overall user progress summary
router.get('/summary', authRequired, async (req, res) => {
  try {
    const totalCompleted = await Progress.countDocuments({ user: req.user.id, completed: true });
    res.json({ totalCompleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Per-topic progress breakdown
router.get('/by-topic', authRequired, async (req, res) => {
  try {
    // Get problem counts per topic
    const allCounts = await Problem.aggregate([
      { $group: { _id: '$topic', total: { $sum: 1 } } },
    ]);

    // Get completed counts per topic for this user
    const completedCounts = await Progress.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id), completed: true } },
      { $lookup: { from: 'problems', localField: 'problem', foreignField: '_id', as: 'p' } },
      { $unwind: '$p' },
      { $group: { _id: '$p.topic', completed: { $sum: 1 } } },
    ]);

    const completedMap = new Map(completedCounts.map((c) => [c._id.toString(), c.completed]));
    const topics = await Topic.find({ _id: { $in: allCounts.map((c) => c._id) } }).select('title');
    const titleMap = new Map(topics.map((t) => [t._id.toString(), t.title]));

    const data = allCounts.map((c) => {
      const completed = completedMap.get(c._id.toString()) || 0;
      const pending = Math.max(0, c.total - completed);
      const percent = c.total ? Math.round((completed / c.total) * 100) : 0;
      return {
        topicId: c._id,
        title: titleMap.get(c._id.toString()) || 'Unknown',
        total: c.total,
        completed,
        pending,
        percent,
      };
    }).sort((a, b) => a.title.localeCompare(b.title));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
