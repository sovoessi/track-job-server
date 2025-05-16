import express from 'express';

const router = express.Router();
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';

router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getJobById).put(updateJob).delete(deleteJob);

export default router;