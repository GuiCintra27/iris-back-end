import { topics } from "@prisma/client";
import { prisma } from "../../config";

async function findManyTopics(): Promise<topics[]> {
    return await prisma.topics.findMany();
}

const topicsRepository = {
    findManyTopics,
  };
  
  export default topicsRepository;