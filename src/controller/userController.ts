import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const postJobController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const {
      jobTitle,
      jobDescription,
      experienceLevel,
      candidates,
      endDate,
      id,
    } = req.body;

    if (!jobTitle)
      return res.status(400).json({
        error: "Job title is required",
      });
    if (!jobDescription)
      return res.status(400).json({
        error: "job description is required",
      });
    if (!experienceLevel)
      return res.status(400).json({
        error: "experience Level is required",
      });
    if (!candidates)
      return res.status(400).json({
        error: "candidates are required",
      });
    if (!endDate)
      return res.status(400).json({
        error: "endDate is required",
      });
    if (!id)
      return res.status(400).json({
        error: "id is required",
      });

    const newJob = await prisma.job.create({
      data: {
        endDate,
        experienceLevel,
        jobDescription,
        jobTitle,
        candidates,
        userId: id,
      },
    });

    return res.status(201).json({
      msg: "job created",
      data: newJob,
    });
  } catch (e) {
    console.log(`Internal server erro in postJobController ${e}`);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
