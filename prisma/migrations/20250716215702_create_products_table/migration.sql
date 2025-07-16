-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(250) NOT NULL,
    "price" MONEY NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP,
    "deletedAt" TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
