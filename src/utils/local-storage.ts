export const LocalStorage = {
    setLocalStorage: (key: string, value: string) => {
        localStorage.setItem(key, value);
    },
    getLocalStorage: (key: string) => {
        return localStorage.getItem(key);
    }
}