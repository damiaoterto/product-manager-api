-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "displayName" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP,
    "deletedAt" TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
