import { defineField, defineType } from "sanity";

export const analyse = defineType({
    name: "analyse",
    title: "Analyse",
    type: "document",
    fields: [
        defineField({
            name: "analyse",
            type: "string",
        })
    ]
})
