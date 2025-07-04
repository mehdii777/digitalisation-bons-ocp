// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('client').title('Clients'),
      S.documentTypeListItem('bon').title('Bons'),
      S.documentTypeListItem('typeBon').title('Types'),
      S.documentTypeListItem('analyse').title('Analyses'),
      S.documentTypeListItem('user').title('Users'),
    ])
