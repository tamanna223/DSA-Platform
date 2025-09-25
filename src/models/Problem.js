import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    title: { type: String, required: true },
    level: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    youtubeUrl: { type: String },
    leetCodeUrl: { type: String },
    codeforcesUrl: { type: String },
    articleUrl: { type: String },
    subIndex: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
