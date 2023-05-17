-- CreateTable
CREATE TABLE "recentlyVisited" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recentlyVisited_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recentlyVisited" ADD CONSTRAINT "recentlyVisited_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recentlyVisited" ADD CONSTRAINT "recentlyVisited_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
