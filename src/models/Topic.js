import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    level: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    youtubeUrl: { type: String },
    leetCodeUrl: { type: String },
    codeforcesUrl: { type: String },
    articleUrl: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;
