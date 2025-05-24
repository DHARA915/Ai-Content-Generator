import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

export const AIOutput=pgTable('aiOutput',{
    id:serial('id').primaryKey().notNull(),
    formdata:varchar('formdata').notNull(),
    aiResponse:text('aiPresponse'),
    templateSlug:varchar('templateSlug').notNull(),
    createdBy:varchar('createdBy'),
    createdAt:varchar('createdAt').notNull(),
})

