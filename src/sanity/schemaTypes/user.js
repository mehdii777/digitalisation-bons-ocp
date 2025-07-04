import { defineField, defineType } from "sanity";

export const user = defineType({
    name: "user",
    title: "User",
    type: "document",
    fields: [
        defineField({
            name: "email",
            type: "string",
        }),
        defineField({
            name: "role",
            type: "string",
            options: {
                list: ["admin", "user"],
            },
        }),

    ]
})