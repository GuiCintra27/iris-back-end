import topicsService from "@/services/topics-service";
import { Request, Response } from "express";
import httpStatus from "http-status";


export async function getTopics(req: Request, res: Response) {
    try {
      const topicsData = await topicsService.getTopicsData();
      return res.status(httpStatus.OK).send(topicsData);
    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send(error);
        }
    
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }