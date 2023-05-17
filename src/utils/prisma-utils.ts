import { TopicIdFilter } from "@/repositories/post-repository";
import { Prisma, posts } from "@prisma/client";

export function exclude<T, Key extends keyof T>(entity: T, ...keys: Key[]): Omit<T, Key> {
  const newEntity = JSON.parse(JSON.stringify(entity));
  for (const key of keys) {
    delete newEntity[key];
  }
  return newEntity;
}

export function createPrismaTopicFilter(topicIdsFilters: TopicIdFilter, inputValueFilter: string) {
  const filter: { where: Prisma.postsWhereInput } | { where: { AND: {} } } = {
    where: {
      AND: {},
    },
  };

  if (topicIdsFilters.topicId?.length !== 0) {
    filter.where.AND = {
      ...filter.where.AND,
      topicId: {
        in: topicIdsFilters.topicId,
      },
    };
  }

  if (inputValueFilter !== "") {
    filter.where.AND = {
      ...filter.where.AND,
      OR: [
        { title: { contains: inputValueFilter, mode: "insensitive" } },
        { text: { contains: inputValueFilter, mode: "insensitive" } },
      ],
    };
  }

  return filter;
}

export interface PostsFilter extends Pick<posts, "id" | "title"> {
  type: "new" | "recent";
}
