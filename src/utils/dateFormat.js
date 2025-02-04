export const customDate = (data)=>{
    const date = new Date(data);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}