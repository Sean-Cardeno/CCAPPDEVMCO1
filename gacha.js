import { Banner1, Banner2 } from "./Banners.js"

var fiveSChance = 3;
var fourSChance = 13;
var threeSChance = 28;
var twoSChance = 58;

var Banner = 0;

const oneRoll = document.getElementById("oneRollButton");
const rewardScreen = document.getElementById("rewardScreen");
const oneS = document.getElementById("oneS");
const twoS = document.getElementById("twoS");
const threeS = document.getElementById("threeS");
const fourS = document.getElementById("fourS");
const fiveS = document.getElementById("fiveS");

const profile = document.getElementById("profile");
const profileText = document.getElementById("profileText");
const errorLog = document.getElementById("errorLog");
var userID;
var loggedIN;

async function readItemDatas() {
    let itemDataR = await fetch('http://localhost:3000/items');
    let itemData = await itemDataR.json();
    return itemData;
}

function getItemIndex(itemDatas) {
    let i;
    let userID = localStorage.getItem("currentUserID")
    for (i = 0; i < itemDatas.length; i++) {
        console.log(itemDatas[i].userID)
        if (userID == itemDatas[i].userID) {
            return i;
        }
    }
    return -1;
}

async function readData(userID) {
    let rollDataR = await fetch('http://localhost:3000/userdatas/' + userID);
    let rollData = await rollDataR.json();
    return rollData;
}

async function updateCurrency() {
    let userData = await readData(userID);
    $('#rolls').text("Rolls: " + userData.Rolls.toString());
    $('#credits').text("¢: " + userData.credits.toString());
}

async function roll() {
    let dice = Math.floor((Math.random() * 100) + 1);
    let star = 0;
    let rollData = await readData(userID);

    console.log(rollData.fiveStarPity);

    rollData.fiveStarPity++;
    rollData.fourStarPity++;
    rollData.TotalRolls++;
    rollData.Rolls--;

    if (rollData.fiveStarPity == 100) {
        fiveSChance = 100;
    }
    if (rollData.fourStarPity == 10) {
        fourSChance = 100;
    }

    if (dice <= fiveSChance) {
        rollData.fiveStarPity = 0;
        fiveSChance = 3;
        star = 5;
    } else if (dice <= fourSChance) {
        rollData.fourStarPity = 0;
        fourSChance = 13;
        star = 4;
    } else if (dice <= threeSChance) {
        star = 3;
    } else if (dice <= twoSChance) {
        star = 2;
    } else {
        star = 1;
    }

    fetch(('http://localhost:3000/userdatas/' + userID), {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "fiveStarPity": rollData.fiveStarPity,
            "fourStarPity": rollData.fourStarPity,
            "Rolls": rollData.Rolls,
            "TotalRolls": rollData.TotalRolls
        })
    });

    return star;
}

async function CreateIMG(obj, i, star) {
    let charIMG = document.createElement("div");
    $(charIMG).attr('id', 'rewardImage');
    if (Banner == 0) {
        $(charIMG).css('background-image', 'url("' + Banner1.itemIMG[star - 1].image + '")');
    } else if (Banner == 1) {
        $(charIMG).css('background-image', 'url("' + Banner2[star - 1].itemIMG[i].image + '")');
    }
    $(charIMG).show();
    $(obj).append(charIMG);
}

oneRoll.addEventListener('click', async (e) => {
    let userData = await readData(userID);
    let randChar = Math.floor(Math.random() * 3);

    if (loggedIN == true && userData != null) {
        if (userData.Rolls > 0) {
            let star = await roll();
            switch (star) {
                case 1:
                    oneS.style.display = "flex";
                    CreateIMG(oneS, randChar, star);
                    break;
                case 2:
                    twoS.style.display = "flex";
                    CreateIMG(twoS, randChar, star);
                    break;
                case 3:
                    threeS.style.display = "flex";
                    CreateIMG(threeS, randChar, star);
                    break;
                case 4:
                    fourS.style.display = "flex";
                    CreateIMG(fourS, randChar, star);
                    break;
                case 5:
                    fiveS.style.display = "flex";
                    CreateIMG(fiveS, randChar, star);
                    break;
            }
            rewardScreen.style.display = "flex";
            let i, found = -1;
            let itemRaw = await readItemDatas();
            let index = getItemIndex(itemRaw);

            if (index != -1) {
                let Items = itemRaw[index];
                let collection = Items.itemIndex.length;
                for (i = 0; i < collection; i++) {
                    if ((Banner == 0 && Banner1.itemName[star - 1] == Items.itemName[i]) || (Banner == 1 && Banner2[star - 1].itemName[randChar] == Items.itemName[i])) {
                        found = i;
                    }
                }
                if (found != -1) {
                    Items.itemCount[found]++;
                } else if (Banner == 0) {
                    Items.itemName.push(Banner1.itemName[star - 1]);
                    Items.itemDesc.push(Banner1.itemDesc[star - 1]);
                    Items.itemPrice.push(Banner1.itemPrice[star - 1]);
                    Items.itemCount.push(1);
                    Items.itemIMG.push(Banner1.itemIMG[star - 1].image);
                    Items.itemRarity.push(Banner1.itemRarity[star - 1]);
                    Items.itemIndex.push(collection);
                } else if (Banner == 1) {
                    Items.itemName.push(Banner2[star - 1].itemName[randChar]);
                    Items.itemDesc.push(Banner2[star - 1].itemDesc[randChar]);
                    Items.itemPrice.push(Banner2[star - 1].itemPrice);
                    Items.itemCount.push(1);
                    Items.itemIMG.push(Banner2[star - 1].itemIMG[randChar].image);
                    Items.itemRarity.push(Banner2[star - 1].itemRarity);
                    Items.itemIndex.push(collection);
                }

                fetch(('http://localhost:3000/items/' + Items._id), {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "itemName": Items.itemName,
                        "itemDesc": Items.itemDesc,
                        "itemPrice": Items.itemPrice,
                        "itemCount": Items.itemCount,
                        "itemIMG": Items.itemIMG,
                        "itemRarity": Items.itemRarity,
                        "itemIndex": Items.itemIndex
                    })
                });
                updateCurrency();
            } else {
                console.log("ERROR");
            }
        }
    }
});

oneRoll.addEventListener('mouseover', async (e) => {
    let userData = await readData(userID);
    if (!loggedIN || userData == null) {
        oneRoll.textContent = "Sign in before rolling";
        profileText.textContent = "Sign in";
        loggedIN = false;
    }
    if (userData.Rolls < 1) {
        oneRoll.textContent = "Insufficient Rolls";
    }
});

oneRoll.addEventListener('mouseout', async (e) => {
    oneRoll.textContent = "Collect a prize!";
});

rewardScreen.addEventListener('click', (e) => {
    rewardScreen.style.display = "none";
    oneS.style.display = "none";
    twoS.style.display = "none";
    threeS.style.display = "none";
    fourS.style.display = "none";
    fiveS.style.display = "none";
    $("#profilePop").css("display", "none");
    $("#rewardImage").remove();
});

async function loadProfile() {
    let userData = await readData(userID);
    $("#profilePop").css("display", "block");
    $("#rewardScreen").css("display", "flex");
    $("#username").text(userData.userName); // Set the username in the profile popup

    if (userData.email != null) {
        $("#email").text(userData.email);
    } else {
        $("#email").text("Email not Verified");
    }
    $("#tasks").text("Tasks completed: " + userData.TotalTasksCompleted);
    $("#totalRolls").text("Total Rolls: " + userData.TotalRolls);
    $("#5Pity").text("5 star pity: " + userData.fiveStarPity);
    $("#4Pity").text("4 star pity: " + userData.fourStarPity);
}

profile.addEventListener('click', (e) => {
    if (loggedIN) {
        loadProfile();
    } else {
        console.log("User is not logged in");
    }
});

$('#BannerSelect').click(function () {
    if (Banner == 0) {
        Banner = 1;
        $('#BannerSelect').text("Banner 2");
        $('#mainDiv').css('background-image', 'url("' + "Cards.jpg" + '")');
        $('#mainDiv').css('background-size', '95vw');
        $('#bannerLabel').html("Rayquaza<br>★★★★★");
        $('#bannerLabel').css('left', '24vw');
    } else if (Banner == 1) {
        Banner = 0;
        $('#BannerSelect').text("Banner 1");
        $('#mainDiv').css('background-image', 'url("' + "Banner.png" + '")');
        $('#mainDiv').css('background-size', 'contain');
        $('#bannerLabel').html("Kobeni's car<br>★★★★★");
        $('#bannerLabel').css('left', '30vw');
    }
});

window.onload = async function () {
    $('#BannerSelect').text("Banner 1");

    userID = localStorage.getItem("currentUserID");
    if (userID != null) {
        let userData = await readData(userID);
        if (userID == userData._id) {
            profileText.textContent = userData.userName;
            loggedIN = true;
            updateCurrency();
        } else {
            console.log("Error");
            profileText.textContent = "Sign in";
            loggedIN = false;
        }
    } else {
        console.log("no user");
        profileText.textContent = "Sign in";
        loggedIN = false;
    }
};
