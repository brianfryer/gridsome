const { createFilterInput } = require('../filters/input')
const { toFilterArgs } = require('../filters/query')

module.exports = schemaComposer => {
  const typeComposer = schemaComposer.createObjectTC({
    name: 'Page',
    fields: {
      path: 'String!',
      context: 'JSON'
    }
  })

  const filterComposer = createFilterInput(schemaComposer, typeComposer)

  schemaComposer.Query.addFields({
    page: {
      type: () => typeComposer,
      args: {
        path: 'String!'
      },
      resolve (_, { path }, { pages }) {
        return pages.findPage({ path })
      }
    },
    allPage: {
      type: () => [typeComposer],
      args: {
        filter: {
          type: filterComposer,
          description: 'Filter pages.'
        }
      },
      resolve (_, { filter }, { pages }) {
        const query = {}

        if (filter) {
          Object.assign(query, toFilterArgs(filter, filterComposer))
        }

        return pages.findPages(query)
      }
    }
  })
}
