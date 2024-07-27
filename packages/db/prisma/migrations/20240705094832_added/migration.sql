-- CreateTable
CREATE TABLE "Account" (
    "acId" SERIAL NOT NULL,
    "acNm" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("acId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");
