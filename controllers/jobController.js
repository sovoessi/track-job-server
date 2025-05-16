import Job from "../models/Job";


export const createJob = async (req, res) => {
    try {
        const { company, position } = req.body;
        if (!company || !position) {
            return res.status(400).json({ message: "Please provide all values" });
        }
        const job = await Job.create({
            ...req.body,
            createdBy: req.user.userId,
        });
        return res.status(201).json({ job });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
        return res.status(200).json({ jobs, count: jobs.length });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getJob = async (req, res) => {
    try {
        const { id: jobId } = req.params;
        const job = await Job.findOne({
            _id: jobId,
            createdBy: req.user.userId,
        });
        if (!job) {
            return res.status(404).json({ message: `No job with id: ${jobId}` });
        }
        return res.status(200).json({ job });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateJob = async (req, res) => {
    try {
        const { id: jobId } = req.params;
        const { company, position } = req.body;
        if (!company || !position) {
            return res.status(400).json({ message: "Please provide all values" });
        }
        const job = await Job.findByIdAndUpdate(
            { _id: jobId, createdBy: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!job) {
            return res.status(404).json({ message: `No job with id: ${jobId}` });
        }
        return res.status(200).json({ job });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteJob = async (req, res) => {
    try {
        const { id: jobId } = req.params;
        const job = await Job.findByIdAndRemove({
            _id: jobId,
            createdBy: req.user.userId,
        });
        if (!job) {
            return res.status(404).json({ message: `No job with id: ${jobId}` });
        }
        return res.status(200).json({ msg: "Success! Job removed" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}