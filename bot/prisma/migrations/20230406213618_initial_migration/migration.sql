-- CreateTable
CREATE TABLE "SoundCommand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "prettyName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "emoji" TEXT,
    "disabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SoundCommand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sound" (
    "id" SERIAL NOT NULL,
    "soundCommandId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT,
    "fileReference" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Sound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usage" (
    "guildId" BIGINT NOT NULL,
    "channelId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "soundId" INTEGER NOT NULL,
    "counter" BIGINT NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,
    "lastUpdate" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SoundCommand_name_key" ON "SoundCommand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Usage_guildId_channelId_userId_soundId_key" ON "Usage"("guildId", "channelId", "userId", "soundId");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Sound" ADD CONSTRAINT "Sound_soundCommandId_fkey" FOREIGN KEY ("soundCommandId") REFERENCES "SoundCommand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_soundId_fkey" FOREIGN KEY ("soundId") REFERENCES "Sound"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
