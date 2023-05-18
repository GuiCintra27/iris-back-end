import { notFoundError } from "../../errors";
import topicsRepository from "../../repositories/topics-repository";
import { topics } from "@prisma/client";

export async function getTopicsData(): Promise<topics[]> {
    const topics = await topicsRepository.findManyTopics();

    if (topics.length < 6) throw notFoundError();

    return topics
}

const topicsService = {
    getTopicsData
};
  
export default topicsService;