const STORAGE_KEY = "finanso_app_martazaorska";

export function getLocalData(){
  try {
    const localData = localStorage.getItem(STORAGE_KEY);
    return localData ? JSON.parse(localData) : {};
  } catch (error) {
    console.error("Error getting local data:", error);
    return {};
  }
}

export function setLocalData(name, value){
  try {
    const currentData = getLocalData();
    currentData[name] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  } catch (error) {
    console.error("Error setting local data:", error);
  }
}

export function deleteLocalData(name){
  try {
    const data = getLocalData();
    delete data[name];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error deleting local data:", error);
  }
}