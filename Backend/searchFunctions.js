const searchByUser = (data, userId) => {
    if (typeof userId === "undefined") {
        return true
    }
    else return data.userId === Number(userId)
}

const filterTag = (data, tag) => {
    console.log(tag)
    if (typeof tag === "undefined") {
        return true
    }
    console.log(data.tags.includes(tag))
    return data.tags.includes(tag)
}



module.exports = { searchByUser, filterTag };