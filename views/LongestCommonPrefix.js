var longestCommonPrefix = function(strs) {
    let pref = "";
    let match = true;
    for(let i = 0; i<strs[0].length; i++){
       if(strs.every(e => e.charAt(i) == strs[0].charAt(i)) && match){
           pref += strs[0].charAt(i);
       }else{
           match = false;
       }
    }
    return pref;
};