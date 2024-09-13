export const increaseFontSize = (id:string, by:number) => {
    const element = document.getElementById(id);
    const currentFontSize = window.getComputedStyle(element!).fontSize;
    const newFontSize = parseInt(currentFontSize) + by;    
    element!.style.fontSize = newFontSize + "px";
}