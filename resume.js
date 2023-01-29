import data from './Data.json' assert {type: 'json'};

window.history.pushState(null, null, window.location.href);
window.onpopstate = function () {
    window.history.go(1);
};


sessionStorage.setItem('currentPosition', '0');
sessionStorage.setItem('currentSearchPosition', '0');
// fetch('./Data.json')
// .then(response => response.json())
// .then(json => console.log(json));

var position = 0;
let finalPosition = data.resume.length - 1;
let searchResults = [];
var searchLength = 0;
var currentSearchPosition = sessionStorage.getItem('currentSearchPosition');
var previousSearchPosition = 0;

const allObjects = getDestructuringData(data)
position = getPositionFromSessionStorage('currentPosition');
updatePage(allObjects, position, finalPosition);
changeVisibility(position, finalPosition);

let searchBoxValue = document.querySelector('#searchBox input');
searchBoxValue.addEventListener('keypress', (event) => {
    if(event.keyCode == 13){
        searchResults = getResults(searchBoxValue.value, allObjects);
        // console.log(searchResults.length);
        if(searchBoxValue.value !== "" && searchResults.length === 0){  //search box has text but search result is 0
            console.log("value not found");
        }else if(searchBoxValue.value === "" && searchResults.length === 0){    //search box has no text, considering it as good as operation without search
            console.log(searchResults);
            const allObjects = getDestructuringData(data);
            changeVisibility(position, finalPosition);
            updatePage(allObjects, position, finalPosition);
        }else{ // searched and found searched value
            searchLength = searchResults.length - 1;
            const searchArrayResObj = getDestructuredSearchData(searchResults);
            changeVisibility(currentSearchPosition, searchLength);
            updatePage(searchArrayResObj, currentSearchPosition, searchLength);
        }
    }
});

document.getElementById("next").addEventListener('click', function (){
    if(searchResults.length > 0){
        // const allObjects = getDestructuringData(searchResults);
        const allObjects = getDestructuredSearchData(searchResults);
        // const [ ...allObjects ] = searchResults;
        currentSearchPosition = getPositionFromSessionStorage('currentSearchPosition');
        if(currentSearchPosition > searchLength){
            currentSearchPosition = searchLength;
        }else{
            currentSearchPosition++;
        }
        console.log("Current position: "+currentSearchPosition);
        sessionStorage.setItem('currentSearchPosition', String(currentSearchPosition));
        changeVisibility(currentSearchPosition, searchLength);
        updatePage(allObjects, currentSearchPosition, searchLength);
        
        // console.log(allObjects);
    }else{
        const allObjects = getDestructuringData(data);
        position = getPositionFromSessionStorage('currentPosition');
        if (position >= finalPosition) {
            position = finalPosition;
        } else {
            position++;
        }
        sessionStorage.setItem('currentPosition', String(position));
        changeVisibility(position, finalPosition);
        updatePage(allObjects, position, finalPosition);
    }
});

document.getElementById("previous").addEventListener('click', function (){
    if(searchResults.length > 0){
        // const allObjects = getDestructuringData(searchResults);
        const allObjects = getDestructuredSearchData(searchResults);
        currentSearchPosition = getPositionFromSessionStorage('currentSearchPosition');
        console.log(currentSearchPosition);
        if(currentSearchPosition <= 0){
            currentSearchPosition = 0;
        }else{
            currentSearchPosition --;
        }
        console.log("Current position: "+currentSearchPosition);
        sessionStorage.setItem('currentSearchPosition', String(currentSearchPosition));
        changeVisibility(currentSearchPosition, searchLength);
        updatePage(allObjects, currentSearchPosition, searchLength);
        
        // console.log(allObjects);
    }else{
        const allObjects = getDestructuringData(data)
        position = getPositionFromSessionStorage('currentPosition');
        if(position <= 0){
            position = 0;
        }else{
            position-- ;
        }
        sessionStorage.setItem('currentPosition', String(position));
        changeVisibility(position, finalPosition);
        updatePage(allObjects, position, finalPosition);
    }
    
});

function getResults(value, allObjects){
    // console.log(allObjects);
    // console.log(Object.entries(allObjects));
    // console.log(Object.entries(allObjects).length);
    console.log("Searching: "+value);
    var backupPage ="";
    var foundFlag = false;
    const arrOfFoundResult = [];
    if(value === ""){
        console.log("is Empty")
        for(let i=0; i<=finalPosition;i++){
            arrOfFoundResult.push(allObjects[i])
        }
    }else{
        for(let i=0; i<=finalPosition;i++){
            // console.log(allObjects[i]);
            let appliedForValue = allObjects[i].basics.AppliedFor;
            if(String(appliedForValue).includes(value)){
                // console.log(allObjects[i]);
                arrOfFoundResult.push(allObjects[i]);
                foundFlag = true;
            }
        }
        if(foundFlag){
            console.log("Total Results Found: "+arrOfFoundResult.length);
        }else{
            console.log("show error page");
            document.querySelector('#previous').setAttribute('hidden','hidden');
            document.querySelector('#next').setAttribute('hidden','hidden');
            backupPage = document.querySelector('main').innerHTML;
            let errorPage = `
            <div style="display: flex; flex-direction: row;justify-content: space-evenly;margin-top: 20%;margin-left: auto;margin-right: auto;align-items: center;padding: 15px 15px;width: 550px;height: 150px;border: 1px solid black;box-shadow: 0px 0px 15px 3px #000000;">
                <img style="height: 100px; width: 100px" src="images.png" alt="black frowning face">
                <p style="font-size: 30px">No such results found</p>
            </div>
            `;
            document.querySelector('main').innerHTML = errorPage;
        }
    }
    // document.querySelector('main').innerHTML = backupPage;
    
    return arrOfFoundResult;
}

function changeVisibility(position, totalLength){
    if(position === 0){
        document.querySelector('#previous').setAttribute('hidden','hidden');
    }else if(position === totalLength){
        document.querySelector('#next').setAttribute('hidden','hidden');
    }else if(position==0 && totalLength==0){
        document.querySelector('#previous').setAttribute('hidden','hidden');
        document.querySelector('#next').setAttribute('hidden','hidden');
    }else{
        document.querySelector('#previous').removeAttribute('hidden');
        document.querySelector('#next').removeAttribute('hidden');
    }
}

function updatePage(allObjects, position, totalLength){
    var objectAtPosition = allObjects[position];
    getBasicsInfo(objectAtPosition);
    getWorkDetails(objectAtPosition);
    getProjectDetails(objectAtPosition);
    getEducationDetails(objectAtPosition);
    getInternshipDetails(objectAtPosition);
    getAchievements(objectAtPosition);
    changeVisibility(position, totalLength);
}

function getPositionFromSessionStorage( sessionStorageKey){
    return position = parseInt(sessionStorage.getItem(sessionStorageKey));
}

function getDestructuringData(data){
    const { resume: { ...desObjects } } = data;
    return desObjects;
}

function getDestructuredSearchData(searchResults){
    const [ ...desArrayObject ] = searchResults; 
    return desArrayObject;
}

function getBasicsInfo(objectAtPosition) {
    //update name, applied for and networking
    const { basics: { name, AppliedFor, image, email, phone, location: { ...location }, profiles: { ...networking } } } = objectAtPosition;
    document.querySelector('#headerBox h2').innerHTML = name;
    document.querySelector('#headerBox p').innerHTML = "Applied For: " + AppliedFor;

    let networkingLink = `<a href="${networking.url}">${networking.network}</a>`;
    document.querySelector('#personalDetailsBox p').innerHTML = `<p>${phone}</p><p>${email}</p><p>${networkingLink}</p>`;

    //update hobbies
    const { interests: { hobbies: [...hobbys] } } = objectAtPosition;
    document.querySelector('#hobby').innerHTML = pTagBuilderFromArray(hobbys);

    //update technical skills
    const { skills: { keywords: [...skill] } } = objectAtPosition;
    document.querySelector('#skill').innerHTML = pTagBuilderFromArray(skill);

}

function getWorkDetails(objectAtPosition) {
    //update work details
    const { work: { ...workvalueobject} } = objectAtPosition;
    const mapOfWork = new Map(Object.entries(workvalueobject));
    let experience = "";
    for(let [workKey, workValue] of mapOfWork){
        let tempLabel = `<span style="font-weight: bold; text-transform: capitalize">${workKey} :</span>`;
        experience +="<p>"+tempLabel+" "+workValue+"</p>";
    }
    document.querySelector('#previousWork').innerHTML = experience;
}

function getProjectDetails(objectAtPosition){
    const { projects: { name, description } } = objectAtPosition;
    let nameOfProject = `<span style="font-weight: bold; text-transform: capitalize">${name} :</span>`;
    document.querySelector('#project').innerHTML = "<p>"+nameOfProject+" "+description+"</p>";
}

function getEducationDetails(objectAtPosition){
    const { education: { ...eduDetails } } = objectAtPosition;
    const mapOfEducation = new Map(Object.entries(eduDetails));
    let educationInfo = "";
    for(let [edKey, edValue] of mapOfEducation){
        let edLevel = `<span style="font-weight: bold; text-transform: capitalize">${edKey} :</span>`;
        educationInfo += "<p>"+edLevel+" "+Object.values(edValue)+"</p>";
    }
    document.querySelector('#education').innerHTML = educationInfo;
}

function getInternshipDetails( objectAtPosition ){
    const{Internship: {...internshipObject}} = objectAtPosition;
    const mapOfIntership = new Map(Object.entries(internshipObject));
    let internshipString = "";
    for(let [internKey, internValue] of mapOfIntership){
        let internLabel = `<span style="font-weight: bold; text-transform: capitalize">${internKey} :</span>`;
        internshipString +="<p>"+internLabel+" "+internValue+"</p>";
    }
    document.querySelector('#internship').innerHTML = internshipString;
}

function getAchievements(objectAtPosition){
    const{achievements: {Summary: [...achivementObject]}} = objectAtPosition;
    document.querySelector('#achievements').innerHTML = pTagBuilderFromArray(achivementObject);
}

function pTagBuilderFromArray( arrayToIterate ){
    let stringValue = "";
    for(let arrElement of arrayToIterate){
        stringValue += "<p>" + arrElement + "</p>";
    }
    return stringValue;
}
