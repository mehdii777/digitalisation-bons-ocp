import { defineField, defineType } from "sanity";

export const bon = defineType({
    name: "bon",
    title: "Bon",
    type: "document",
    fields: [
        defineField({
            name: "num",
            type: "string",
        }),
        defineField({
            name: "idClient",
            type: "reference",
            to: [{type: "client"}],
        }),
        defineField({
            name: "typeBon",
            type: "reference",
            to: [{type: "typeBon"}],
        }),
        defineField({
            name: "analyses",
            type: "array",
            of: [{
                type: "reference",
                to: [{type: "analyse"}]
            }],
            validation: Rule => Rule.unique()
        }),
        defineField({
            name: "status",
            type: "string",
            options: {
                list: ["en cours", "traité"],
            },
        }),
        defineField({
            name: "validity",
            type: "string",
            options: {
                list: ["permanent", "non permanent"],
            },
        }),
        defineField({
            name: "date",
            type: "date",
        }),
        defineField({
            name: 'chefServiceSignature',
            title: 'Signature Chef de Service',
            type: 'image',
            options: {
                hotspot: true
            },
        }),
        defineField({
            name: "user",
            type: "string",
            title: "User",
            description: "User who created or updated the bon",
        }),
    ]
})

