/*
  Warnings:

  - The primary key for the `devices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `device_identifier` on the `devices` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "sensor_readings" DROP CONSTRAINT "sensor_readings_device_id_fkey";

-- DropIndex
DROP INDEX "devices_device_identifier_key";

-- AlterTable
ALTER TABLE "devices" DROP CONSTRAINT "devices_pkey",
DROP COLUMN "device_identifier",
ADD COLUMN     "wifi_name" VARCHAR(255),
ADD COLUMN     "wifi_password" VARCHAR(255),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "devices_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "devices_id_seq";

-- AlterTable
ALTER TABLE "sensor_readings" ALTER COLUMN "device_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "sensor_readings" ADD CONSTRAINT "sensor_readings_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
