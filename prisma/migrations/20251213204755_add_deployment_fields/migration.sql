-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "deployedAt" TIMESTAMP(3),
ADD COLUMN     "deploymentUrl" TEXT,
ADD COLUMN     "isDeployed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestCount" INTEGER NOT NULL DEFAULT 0;
