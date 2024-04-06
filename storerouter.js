const profile = document.getElementById("profile"); //Copy over
const profileText = document.getElementById("profileText"); //Copy over
var profileLink //Copy over
var userID //Copy over
var loggedIN //Copy over//New~!


const readData = async () => {
    let rollDataR = await fetch('http://localhost:3000/userdatas/' + userID)
    let rollData = await rollDataR.json();
    return rollData;
};

const readItemDatas = async () => {
    let itemDataR = await fetch('http://localhost:3000/items');
    let itemData = await itemDataR.json();
    return itemData;
}

function getItemIndex(itemDatas) {//Important copy over
    let i;
    let userID = localStorage.getItem("currentUserID")
    for(i=0; i<itemDatas.length; i++){
        console.log(itemDatas[i].userID)
        if(userID == itemDatas[i].userID){
            return i;
        }
    }
    return -1;
}

async function updateCurrency(){
    let UserData = await readData()
    $('#rolls').text("Rolls: " + UserData.Rolls.toString())
    $('#credits').text("¢: " + UserData.credits.toString())
}

$("#charHolder").on('click', ".actionButton", async function() {
    let element = $(this)
    let parent = ($(element).parent())

    let price = Number($(element).attr('id'))
    let reward = Number($(parent).attr('id'))

    let UserData = await readData()
    

    if(UserData.credits > price){
        fetch(('http://localhost:3000/userdatas/' + userID), {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "credits" : UserData.credits - price,
                "Rolls" : UserData.Rolls + reward
            })
        }).then(updateCurrency)
    }else{
        $(element).text("Insufficent Credits")
    }
})

//bring up
async function loadProfile(){
    let userData = await readData()
    $("#profilePop").css("display", "block")
    $("#rewardScreen").css("display", "flex")
    $("#username").text(userData.userName)
    
    
    if (userData.email != null){
        $("#email").text(userData.email)
    } else {
        $("#email").text("Email not Verified")
    }
    $("#tasks").text("Tasks completed: " + userData.TotalTasksCompleted)
    $("#totalRolls").text("Total Rolls: " + userData.TotalRolls)
}

rewardScreen.addEventListener('click', (e) =>{
    rewardScreen.style.display = "none";
    $("#profilePop").css("display", "none")

})

//copy over
profile.addEventListener('click', (e) =>{
    if(loggedIN == false){
        window.location.href = profileLink
    }else {
        loadProfile()
    }
    
})
//copy over new!
window.onload = async function() {
    userID = localStorage.getItem("currentUserID")
    if (userID != null) {
        let userData = await readData()
        if(userID == userData._id) {//checks if no changes have been made
            console.log(localStorage.getItem("currentUserID"))
            profileText.textContent = userData.userName
            loggedIN = true
            $(".owned").css("display", "none")
            switched = false
            profileLink = "FindAcc.html"//change to Profile.html
            updateCurrency()
        } else {
            console.log("Error")
            profileText.textContent = "Sign in"
            profileLink = "FindAcc.html"
            loggedIN = false
        }
            
    } else {
        console.log("no user")
        profileText.textContent = "Sign in"
        profileLink = "FindAcc.html"
        loggedIN = false
    }


};