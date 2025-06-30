export const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }

  fragment GrandchildMenuItem on MenuItem {
    ...MenuItem
  }

  fragment ChildMenuItem on MenuItem {
    ...MenuItem
    items {
      ...GrandchildMenuItem
    }
  }

  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }

  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;