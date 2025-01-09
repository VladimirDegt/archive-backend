function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0'); // День
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц (начинается с 0)
    const year = String(date.getFullYear()).slice(-2); // Последние две цифры года

    return `${day}.${month}.${year}`;
}

module.exports = formatDate;