const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-pwLength]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCheck = document.querySelector("#uppercase");
const lowerCheck = document.querySelector("#lowercase");
const numCheck = document.querySelector("#numbers");
const symCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const genetrateBtn = document.querySelector(".generate-button");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");

const symbols = "`~!@#$%^&*()_+=-/*-[{]}\:;'<>,.?";


let password = "";
let passwordLength = 10;
let checkCount = 0;
// setCircle color to GRAY initially
handleSlider();



function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.background = `linear-gradient(to right, yellow ${(passwordLength - min) / (max - min) * 100}%, white ${(passwordLength - min) / (max - min) * 100}%)`;
    // inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 5px 1px ${color}`
}

function getRandomInt(min, max) {
    return Math.floor(Math.random()*(max-min)+min);
}

function generateRndmNumber() {
    return getRandomInt(0, 9);
}

function generateRndmLower() {
    return String.fromCharCode(getRandomInt(97, 123));
}

function generateRndmUpper() {
    return String.fromCharCode(getRandomInt(65, 91));
}

function generateRndmSymbol() {
    return symbols[getRandomInt(0, symbols.length)];
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upperCheck.checked) hasUpper=true;
    if(lowerCheck.checked) hasLower=true;
    if(numCheck.checked) hasNum=true;
    if(symCheck.checked) hasSym=true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator('#0f0');
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator('#FFC300');
    } else {
        setIndicator('#f00');
    }
}

async function copyText() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch(e) {
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function handleCheckboxChange() {
    checkCount = 0;
    allCheckbox.forEach((chkbox) => {
        if(chkbox.checked)
            checkCount++;
    });
    
    // special condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckbox.forEach((chkbox) => {     // can also do it for each of the checkboxes individually
    chkbox.addEventListener('change', handleCheckboxChange);
});

inputSlider.addEventListener('input', (event) => {
    passwordLength = event.target.value;
    handleSlider();  // to change in UI
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {    // OR if (passwordDisplay.length > 0) {}
        copyText();
    }
});

function shufflePassword(array) {
    // Fisher Yates Method
    for(let i = 0; i < array.length; i++) {
        const j = Math.floor(Math.random()*(i+1));     // Random Numbers between (0, i+1) range
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

genetrateBtn.addEventListener('click', () => {
    if(checkCount <= 0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";  // remove old password, everytime clicked the button

    // if(upperCheck.checked) {
    //     password += generateRndmUpper();
    // }
    // if(lowerCheck.checked) {
    //     password += generateRndmLower();
    // }
    // if(numCheck.checked) {
    //     password += generateRndmNumber();
    // }
    // if(symCheck.checked) {
    //     password += generateRndmSymbol();
    // }

    let funcArr = [];

    if(upperCheck.checked) {
        funcArr.push(generateRndmUpper);
    }
    if(lowerCheck.checked) {
        funcArr.push(generateRndmLower);
    }
    if(numCheck.checked) {
        funcArr.push(generateRndmNumber);
    }
    if(symCheck.checked) {
        funcArr.push(generateRndmSymbol);
    }

    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRandomInt(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();
});


passwordDisplay.style.cssText = "font-family: 'Courier New', Courier, monospace; font-weight: 900; font-size: 25px; padding-left: 10px; letter-spacing: 3px";