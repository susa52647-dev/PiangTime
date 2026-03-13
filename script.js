// SUPABASE
const supabaseUrl = "https://mjgazsuzgcmigsoqfpka.supabase.co"

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcWF6c3V6Z2NtaWdzb3FmcGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDAxMDEsImV4cCI6MjA4ODk3NjEwMX0.diKc0JKRowJ7LzSQhsS6ZOuAD6xwr8HN62i4jGinOxQ"

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)



// PASSWORD
function checkPassword(){

const pass = document.getElementById("passwordInput").value.trim()

if(pass === "Tumpihungry"){
document.getElementById("lockScreen").style.display="none"
}
else{
alert("Wrong password")
}

}



// CLOUDINARY UPLOAD
async function uploadImage(){

let file = document.getElementById("imageInput").files[0]

if(!file){
alert("กรุณาเลือกรูป")
return null
}

let formData = new FormData()

formData.append("file", file)
formData.append("upload_preset", "memory_upload")

try{

let res = await fetch("https://api.cloudinary.com/v1_1/dtzmwztuj/image/upload",{
method:"POST",
body:formData
})

let data = await res.json()

return data.secure_url

}catch(error){

console.log("Upload error:",error)
alert("Upload image error")
return null

}

}



// ADD MEMORY
async function addMemory(){

let date = document.getElementById("dateInput").value
let text = document.getElementById("textInput").value

if(!date || !text){
alert("Please fill everything")
return
}

let imageURL = await uploadImage()

if(!imageURL){
return
}

let { error } = await supabaseClient
.from("memories")
.insert([
{
date: date,
text: text,
image: imageURL
}
])

if(error){

console.log(error)
alert("Save memory error")
return

}

loadMemories()

document.getElementById("textInput").value=""
document.getElementById("imageInput").value=""

}



// LOAD MEMORIES
async function loadMemories(){

let { data, error } = await supabaseClient
.from("memories")
.select("*")
.order("date",{ascending:false})

if(error){
console.log("Load error:",error)
return
}

let container = document.getElementById("memoryContainer")

container.innerHTML=""

data.forEach(memory=>{

let card=document.createElement("div")

card.className="memory-card fade-in"

card.innerHTML=`
<img src="${memory.image}" onclick="openViewer('${memory.image}')">
<p><b>${memory.date}</b></p>
<p>${memory.text}</p>
`

container.appendChild(card)

})

}



// IMAGE VIEWER
function openViewer(src){

let viewer=document.getElementById("imageViewer")

let img=document.getElementById("viewerImage")

img.src=src

viewer.style.display="flex"

}

function closeViewer(){

document.getElementById("imageViewer").style.display="none"

}



// HEART EFFECT
function createHearts(){

let container=document.getElementById("heartContainer")

for(let i=0;i<25;i++){

let heart=document.createElement("div")

heart.className="heart"

heart.innerHTML="❤"

heart.style.left=Math.random()*100+"vw"
heart.style.bottom="0px"
heart.style.fontSize=(Math.random()*20+15)+"px"

container.appendChild(heart)

setTimeout(()=>{
heart.remove()
},3000)

}

}



// ENTER KEY LOGIN
document.addEventListener("DOMContentLoaded",function(){

let input=document.getElementById("passwordInput")

if(input){
input.addEventListener("keypress",function(e){
if(e.key==="Enter"){
checkPassword()
}
})
}

loadMemories()

})
