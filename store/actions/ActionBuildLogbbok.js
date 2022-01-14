export const UPDATE_BUILDLOGBOOK = 'UPDATE_BUILDLOGBOOK'

export const buildLogBook = (buildLogBook) => {
    return{
        type: UPDATE_BUILDLOGBOOK,
        data: buildLogBook
    }
}