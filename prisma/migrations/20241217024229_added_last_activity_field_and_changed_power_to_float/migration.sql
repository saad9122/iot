/*
  Warnings:

  - You are about to drop the column `is_active` on the `devices` table. All the data in the column will be lost.
  - The `power` column on the `sensor_readings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "devices" DROP COLUMN "is_active",
ADD COLUMN     "last_activity_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sensor_readings" DROP COLUMN "power",
ADD COLUMN     "power" DOUBLE PRECISION;
