const updateStocks = (stocks) => {
    return {
        type: 'UPDATE_STOCKS',
        stocks,
    }
}

const changeAmount = (stocks) => {
    return {
        type: 'UPDATE_STOCKS',
        stocks,
    }
}

export default updateStocks;