import { Router } from 'express';
import Topic from '../models/Topic.js';
import Problem from '../models/Problem.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// Get all topics with counts
router.get('/', authRequired, async (_req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1, createdAt: 1 });
    const ids = topics.map((t) => t._id);
    const counts = await Problem.aggregate([
      { $match: { topic: { $in: ids } } },
      { $group: { _id: '$topic', count: { $sum: 1 } } },
    ]);
    const map = new Map(counts.map((c) => [c._id.toString(), c.count]));
    res.json(
      topics.map((t) => ({
        id: t._id,
        title: t.title,
        description: t.description,
        level: t.level,
        youtubeUrl: t.youtubeUrl,
        leetCodeUrl: t.leetCodeUrl,
        codeforcesUrl: t.codeforcesUrl,
        articleUrl: t.articleUrl,
        order: t.order,
        problemCount: map.get(t._id.toString()) || 0,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
