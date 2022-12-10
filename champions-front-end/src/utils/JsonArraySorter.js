export function sortStringsInAscendingOrder(a, b) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();
  
    return (a < b) ? -1 : (a > b) ? 1 : 0;
}
export function sortNumberInAscendingOrder(a, b) {
   return a-b; 
}
export function sortStringsInDescendingOrder(a, b) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();
  
    return (a > b) ? -1 : (a < b) ? 1 : 0;
}
export function sortNumberInDescendingOrder(a, b) {
    return b-a; 
 }