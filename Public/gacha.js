import { Banner1, Banner2 } from "./Banners.js";

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

async function fetchWithErrorHandling(url, options) {
    try {
        let response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error.message);
        return null;
    }
}

async function readItemDatas() {
    return await fetchWithErrorHandling('/items');
}

function getItemIndex(itemDatas) {
    let userID = localStorage.getItem("currentUserID")
    for (let i = 0; i < itemDatas.length; i++) {
        if (userID === itemDatas[i].userID) {
            return i;
        }
    }
    return -1;
}

async function readData(userID) {
    return await fetchWithErrorHandling('/userdatas/' + userID);
}

async function updateCurrency() {
    let userData = await readData(userID);
    if (userData) {
        $('#rolls').text("Rolls: " + userData.Rolls.toString());
        $('#credits').text("¢: " + userData.credits.toString());
    }
}

async function roll() {
    let dice = Math.floor((Math.random() * 100) + 1);
    let star = 0;
    let rollData = await readData(userID);

    if (!rollData) return;

    rollData.fiveStarPity++;
    rollData.fourStarPity++;
    rollData.TotalRolls++;
    rollData.Rolls--;

    if (rollData.fiveStarPity === 100) {
        fiveSChance = 100;
    }
    if (rollData.fourStarPity === 10) {
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

    await fetchWithErrorHandling('/userdatas/' + userID, {
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
    let imgUrl = (Banner === 0) ? Banner1.itemIMG[star - 1].image : Banner2[star - 1].itemIMG[i].image;
    $(charIMG).css('background-image', 'url("' + imgUrl + '")');
    $(charIMG).show();
    $(obj).append(charIMG);
}

oneRoll.addEventListener('click', async () => {
    let userData = await readData(userID);
    let randChar = Math.floor(Math.random() * 3);

    if (loggedIN && userData) {
        if (userData.Rolls > 0) {
            let star = await roll();
            let containers = [oneS, twoS, threeS, fourS, fiveS];
            containers.forEach((container, index) => {
                if (star - 1 === index) {
                    container.style.display = "flex";
                    CreateIMG(container, randChar, star);
                } else {
                    container.style.display = "none";
                }
            });
            rewardScreen.style.display = "flex";

            let itemRaw = await readItemDatas();
            if (itemRaw) {
                let index = getItemIndex(itemRaw);
                if (index !== -1) {
                    let Items = itemRaw[index];
                    let collection = Items.itemIndex.length;
                    let found = Items.itemName.findIndex((itemName, i) => {
                        return (Banner === 0 && Banner1.itemName[star - 1] === itemName) ||
                            (Banner === 1 && Banner2[star - 1].itemName[randChar] === itemName);
                    });

                    if (found !== -1) {
                        Items.itemCount[found]++;
                    } else {
                        let itemToAdd = (Banner === 0) ? Banner1 : Banner2[star - 1];
                        Items.itemName.push(itemToAdd.itemName[randChar]);
                        Items.itemDesc.push(itemToAdd.itemDesc[randChar]);
                        Items.itemPrice.push(itemToAdd.itemPrice);
                        Items.itemCount.push(1);
                        Items.itemIMG.push(itemToAdd.itemIMG[randChar].image);
                        Items.itemRarity.push(itemToAdd.itemRarity);
                        Items.itemIndex.push(collection);
                    }

                    await fetchWithErrorHandling('/items/' + Items._id, {
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
    }
});

oneRoll.addEventListener('mouseover', async () => {
    let userData = await readData(userID);
    if (!loggedIN || !userData) {
        oneRoll.textContent = "Sign in before rolling";
        profileText.textContent = "Sign in";
        loggedIN = false;
    } else if (userData.Rolls < 1) {
        oneRoll.textContent = "Insufficient Rolls";
    }
});

oneRoll.addEventListener('mouseout', () => {
    oneRoll.textContent = "Collect a prize!";
});

rewardScreen.addEventListener('click', () => {
    rewardScreen.style.display = "none";
    [oneS, twoS, threeS, fourS, fiveS].forEach(container => {
        container.style.display = "none";
    });
    $("#profilePop").css("display", "none");
    $("#rewardImage").remove();
});

async function loadProfile() {
    let userData = await readData(userID);
    if (userData) {
        $("#profilePop").css("display", "block");
        $("#rewardScreen").css("display", "flex");
        $("#username").text(userData.userName); // Set the username in the profile popup
        $("#email").text(userData.email ? userData.email : "Email not Verified");
        $("#tasks").text("Tasks completed: " + userData.TotalTasksCompleted);
        $("#totalRolls").text("Total Rolls: " + userData.TotalRolls);
        $("#5Pity").text("5 star pity: " + userData.fiveStarPity);
        $("#4Pity").text("4 star pity: " + userData.fourStarPity);
    }
}

profile.addEventListener('click', () => {
    if (loggedIN) {
        loadProfile();
    } else {
        console.log("User is not logged in");
    }
});

$('#BannerSelect').click(function () {
    if (Banner === 0) {
        Banner = 1;
        $('#BannerSelect').text("Banner 2");
        $('#mainDiv').css('background-image', 'url("' + "Cards.jpg" + '")');
        $('#mainDiv').css('background-size', '95vw');
        $('#bannerLabel').html("Rayquaza<br>★★★★★");
        $('#bannerLabel').css('left', '24vw');
    } else if (Banner === 1) {
        Banner = 0;
        $('#BannerSelect').text("Banner 1");
        $('#mainDiv').css('background-image', 'url("' + "Banner.png" + '")');
        $('#mainDiv').css('background-size', 'contain');
        $('#bannerLabel').html("Kobeni's car<br>★★★★★");
        $('#bannerLabel').css('left', '30vw');
    }
});

window.onload = async function () {
    userID = localStorage.getItem("currentUserID");
    if (userID) {
        let userData = await readData(userID);
        if (userData && userID === userData._id) {
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
