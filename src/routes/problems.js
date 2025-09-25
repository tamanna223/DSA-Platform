import { Router } from 'express';
import Problem from '../models/Problem.js';
import Progress from '../models/Progress.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// Get problems for a topic, include user's progress
router.get('/by-topic/:topicId', authRequired, async (req, res) => {
  try {
    const { topicId } = req.params;
    const problems = await Problem.find({ topic: topicId }).sort({ subIndex: 1, createdAt: 1 });
    const pIds = problems.map((p) => p._id);
    const progress = await Progress.find({ user: req.user.id, problem: { $in: pIds } });
    const pMap = new Map(progress.map((pr) => [pr.problem.toString(), pr.completed]));

    res.json(
      problems.map((p) => ({
        id: p._id,
        title: p.title,
        level: p.level,
        youtubeUrl: p.youtubeUrl,
        leetCodeUrl: p.leetCodeUrl,
        codeforcesUrl: p.codeforcesUrl,
        articleUrl: p.articleUrl,
        subIndex: p.subIndex,
        completed: !!pMap.get(p._id.toString()),
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
