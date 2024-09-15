const capitalize = (value: string) => {
    return value.toLowerCase().charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export default capitalize;