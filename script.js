```javascript
const supabaseUrl = "https://mjgazsuzgcmigsoqfpka.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcWF6c3V6Z2NtaWdzb3FmcGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDAxMDEsImV4cCI6MjA4ODk3NjEwMX0.diKc0JKRowJ7LzSQhsS6ZOuAD6xwr8HN62i4jGinOxQ"
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

let editingId = null

function checkPassword(){

const pass = document.getElementById("passwordInput").value

if(pass === "1234"){

document.getElementById("lockScreen").style.display = "none"
loadMemories()

}else{

alert("Wrong password")

}

}



async function loadMemories(){

const container = document.getElementById("memoryContainer")
container.innerHTML = "Loading..."

const { data, error } = await supabase
.from("memories")
.select("*")
.order("date",{ascending:false})

if(error){

container.innerHTML="Error loading"
console.log(error)
return

}

container.innerHTML=""

data.forEach(memory=>{

const card=document.createElement("div")
card.className="memory-card"

card.innerHTML=`
<img src="${memory.image}" onclick="openViewer('${memory.image}')">

<h3>${memory.date}</h3>

<p>${memory.text}</p>

<button onclick="editMemory(${memory.id})">Edit</button>
<button onclick="deleteMemory(${memory.id})">Delete</button>
`

container.appendChild(card)

})

}



async function deleteMemory(id){

const confirm1=confirm("Delete this memory?")
if(!confirm1)return

const confirm2=confirm("Are you sure?")
if(!confirm2)return

await supabase
.from("memories")
.delete()
.eq("id",id)

loadMemories()

}



async function editMemory(id){

const {data}=await supabase
.from("memories")
.select("*")
.eq("id",id)
.single()

document.getElementById("dateInput").value=data.date
document.getElementById("textInput").value=data.text

editingId=id

window.scrollTo({
top:document.getElementById("add").offsetTop,
behavior:"smooth"
})

}



function openViewer(src){

document.getElementById("viewerImage").src=src
document.getElementById("imageViewer").style.display="flex"

}



function closeViewer(){

document.getElementById("imageViewer").style.display="none"

}
```

