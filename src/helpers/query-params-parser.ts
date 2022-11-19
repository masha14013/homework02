export const queryParamsParser = (query: { pageNumber: string, pageSize: string, sortBy: string, sortDirection: string, searchLoginTerm: string, searchEmailTerm: string }) => {
    let pageNumber = +query.pageNumber || 1
    let pageSize = +query.pageSize || 10
    let sortBy = query.sortBy || 'createdAt'
    let sortDirection = query.sortDirection === 'asc' ? 1 : -1
    let searchLoginTerm = query.searchLoginTerm || ''
    let searchEmailTerm = query.searchEmailTerm || ''

    return {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchLoginTerm,
        searchEmailTerm
    }
}