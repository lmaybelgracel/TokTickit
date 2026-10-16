-- CreateTable
CREATE TABLE "actions_taken" (
    "id" SERIAL NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "performed_by_id" INTEGER NOT NULL,
    "action_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "follow_up_required" BOOLEAN NOT NULL DEFAULT false,
    "follow_up_note" TEXT,
    "attachment_notes" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actions_taken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "actions_taken_ticket_id_idx" ON "actions_taken"("ticket_id");

-- CreateIndex
CREATE INDEX "actions_taken_performed_by_id_idx" ON "actions_taken"("performed_by_id");

-- CreateIndex
CREATE INDEX "actions_taken_action_date_time_idx" ON "actions_taken"("action_date_time");

-- AddForeignKey
ALTER TABLE "actions_taken" ADD CONSTRAINT "actions_taken_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions_taken" ADD CONSTRAINT "actions_taken_performed_by_id_fkey" FOREIGN KEY ("performed_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
