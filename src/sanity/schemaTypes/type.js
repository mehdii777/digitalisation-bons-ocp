import { defineField, defineType } from "sanity";

export const type = defineType({
    name: "typeBon",
    title: "TypeBon",
    type: "document",
    fields: [
        defineField({
            name: "typeBon",
            type: "string",
        })
    ]
})
