import { defineField, defineType } from "sanity";

export const client = defineType({
    name: "client",
    title: "Client",
    type: "document",
    fields: [
        defineField({
            name: "identite",
            type: "string",
        })
    ]
})