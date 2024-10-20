import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { sendMultipleMails } from "../lib/utils";
import {format} from "date-fns"

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

export const getJobsController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.query;

    if (!id)
      return res.status(400).json({
        error: "id is required",
      });

    const jobs = await prisma.job.findMany({
      where: {
        userId: id.toString(),
      },
    });

    return res.status(200).json({
      msg: "job fetched",
      data: jobs,
    });
  } catch (e) {
    console.log(`Internal server error in getJobsController ${e}`);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};



export const sendMailsController = async(req: Request, res: Response): Promise<any> => {
  try {
    const { candidatesEmail,job } = req.body;
    if(!candidatesEmail) return res.status(400).json({
      error:"candidates email is required"
    })
    if (!job) return res.status(400).json({
      error: "job is required"
    });

    const user = await prisma.user.findFirst({
      where:{
        Jobs:{
          some:{
            id:job.id
          }
        }
      }
    })

    const subject = `Job opening at ${user?.companyName}`
    const message = 
    `<p>Hello, there is a new job posting for ${job.jobTitle} in our company ${user?.companyName}</p><br/>
      Here is the job description ${job.jobDescription}<br/>
      Please apply before ${format(job.endDate,'dd/MM/yyyy')}
    `;

    const mailInfo =  await sendMultipleMails({
      candidatesEmail,
      message,
      subject
    })

    if(!mailInfo) return res.status(400).json({
      error:'Mail not send'
    })

    return res.status(200).json({
      msg:'Emails send',
      data:{subject,message},
    })
  }
  catch (e) {
    console.log(e);
    return res.status(500).json({
      error: 'Internal server error'
    })
  }
}