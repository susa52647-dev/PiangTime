let memories = JSON.parse(localStorage.getItem("memories")) || []
let editingIndex = null
async function uploadImage(){

let file = document.getElementById("imageInput").files[0]

if(!file){
alert("กรุณาเลือกรูป")
return
}

let formData = new FormData()

formData.append("file", file)
formData.append("upload_preset", "memory_upload")

let res = await fetch("https://api.cloudinary.com/v1_1/dtzmwztuj/image/upload",{
method:"POST",
body:formData
})

let data = await res.json()

return data.secure_url
}
function saveMemories(){
localStorage.setItem("memories", JSON.stringify(memories))
}

function renderMemories(){

let container = document.getElementById("memoryContainer")
container.innerHTML=""

memories.sort((a,b)=> new Date(b.date) - new Date(a.date))

memories.forEach((memory,index)=>{

let card=document.createElement("div")
card.className="memory-card fade-in"
card.style.animationDelay = index * 0.15 + "s"

card.innerHTML=`

<img src="${memory.image}" onclick="toggleButtons(this)">

<p class="memory-date">${memory.date}</p>
<p class="memory-text">${memory.text}</p>

<div class="memory-buttons">

<button onclick="editMemory(${index})">Edit</button>

<button onclick="deleteMemory(${index})">Delete</button>

<button onclick="openImage('${memory.image}')">View</button>

</div>

`

container.appendChild(card)

})

}

async function addMemory(){

let date = document.getElementById("dateInput").value
let text = document.getElementById("textInput").value

let imageURL = await uploadImage()

let container = document.getElementById("memoryContainer")

let card = document.createElement("div")
card.className="memory-card"

card.innerHTML = `
<img src="${imageURL}">
<p><b>${date}</b></p>
<p>${text}</p>
`

container.appendChild(card)

}

if(editingIndex !== null){

memories[editingIndex].date=date
memories[editingIndex].text=text

editingIndex=null

saveMemories()
renderMemories()
clearInputs()

return
}

if(!file){
alert("Please choose image")
return
}

let reader=new FileReader()

reader.onload=function(e){

memories.push({
date:date,
text:text,
image:e.target.result
})

saveMemories()
renderMemories()
clearInputs()

}

reader.readAsDataURL(file)

}

function deleteMemory(index){

if(confirm("Delete this memory?")){

memories.splice(index,1)

saveMemories()
renderMemories()

}

}

function editMemory(index){

let memory=memories[index]

document.getElementById("dateInput").value=memory.date
document.getElementById("textInput").value=memory.text

editingIndex=index

window.scrollTo({
top:document.getElementById("add").offsetTop,
behavior:"smooth"
})

}

function toggleButtons(img){

let buttons=img.parentElement.querySelector(".memory-buttons")

buttons.classList.toggle("show")

}

function clearInputs(){

document.getElementById("dateInput").value=""
document.getElementById("textInput").value=""
document.getElementById("imageInput").value=""

}

function openImage(src){

let viewer=document.getElementById("imageViewer")
let image=document.getElementById("viewerImage")

image.src=src
viewer.style.display="flex"

}

function closeViewer(){

document.getElementById("imageViewer").style.display="none"

}

function createHearts(){

let container = document.getElementById("heartContainer")

for(let i=0;i<25;i++){

let heart=document.createElement("div")

heart.className="heart"
heart.innerHTML="❤"

heart.style.left=Math.random()*100+"vw"
heart.style.bottom="0px"

container.appendChild(heart)

setTimeout(()=>{
heart.remove()
},3000)

}

}

renderMemories()

const password = "Tumpiishungry"

function checkPassword(){

let input=document.getElementById("passwordInput").value

if(input===password){

document.getElementById("lockScreen").style.display="none"

createHearts()

}else{

alert("Wrong password")

}

}
document.getElementById("passwordInput").addEventListener("keypress",function(e){

if(e.key==="Enter"){
checkPassword()
}

})
function createHearts(){

let container = document.getElementById("heartContainer")

for(let i=0;i<25;i++){

let heart = document.createElement("div")

heart.className="heart"
heart.innerHTML="❤"

heart.style.left = Math.random()*100 + "vw"
heart.style.bottom = "0px"
heart.style.fontSize = (Math.random()*20+15) + "px"

container.appendChild(heart)

setTimeout(()=>{
heart.remove()
},3000)

}


}
