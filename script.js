// ===== SUPABASE CONFIG =====
const supabaseUrl = "https://mjgazsuzgcmigsoqfpka.supabase.co"
const supabaseKey = "ใส่คีย์ของคุณตรงนี้" // <--- ใส่คีย์จริงของคุณตรงนี้
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// เริ่มระบบเมื่อโหลดหน้าเว็บ
window.onload = function() {
    createHearts(); // เรียกใช้หัวใจปลิว
}

// ===== LOGIN SYSTEM =====
function checkPassword() {
    const pass = document.getElementById("passwordInput").value
    
    if(pass === "1234") {
        document.getElementById("lockScreen").style.display = "none"
        loadMemories() // โหลดข้อมูลเมื่อรหัสผ่านถูกต้อง
    } else {
        alert("รหัสผ่านไม่ถูกต้อง! กรุณาลองใหม่อีกครั้ง") [cite: 4]
        document.getElementById("passwordInput").value = ""
    }
}

// อนุญาตให้กด Enter เพื่อเช็ครหัสผ่าน
document.getElementById("passwordInput")?.addEventListener("keypress", function(e) {
    if (e.key === "Enter") checkPassword();
});

// ===== LOAD MEMORIES =====
async function loadMemories() {
    const container = document.getElementById("memoryContainer")
    container.innerHTML = "<p>Loading memories...</p>"

    const { data, error } = await supabase
        .from("memories")
        .select("*")
        .order("date", { ascending: false })

    if(error) {
        console.error(error)
        container.innerHTML = "Error loading memories"
        return
    }

    container.innerHTML = ""
    data.forEach(function(memory) {
        const card = document.createElement("div")
        card.className = "memory-card"
        card.innerHTML = `
            <img src="${memory.image}" onclick="openViewer('${memory.image}')">
            <h3>${memory.date}</h3>
            <p>${memory.text}</p>
            <button style="background:#ff6b6b; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;" 
                onclick="deleteMemory(${memory.id})">Delete</button>
        `
        container.appendChild(card)
    })
}

// ===== ADD MEMORY =====
async function addMemory() {
    const date = document.getElementById("dateInput").value
    const text = document.getElementById("textInput").value
    const file = document.getElementById("imageInput").files[0]

    if(!date || !text || !file) {
        alert("กรุณากรอกข้อมูลและเลือกรูปภาพให้ครบครับ") [cite: 5]
        return
    }

    const reader = new FileReader()
    reader.onload = async function() {
        const base64 = reader.result
        const { error } = await supabase
            .from("memories")
            .insert([{ date: date, text: text, image: base64 }])

        if(error) {
            alert("เกิดข้อผิดพลาด: " + error.message)
        } else {
            document.getElementById("dateInput").value = ""
            document.getElementById("textInput").value = ""
            document.getElementById("imageInput").value = ""
            loadMemories()
        }
    }
    reader.readAsDataURL(file)
}

// ===== DELETE MEMORY =====
async function deleteMemory(id) {
    if(!confirm("คุณแน่ใจนะว่าจะลบความทรงจำนี้?")) return [cite: 13]
    
    const { error } = await supabase.from("memories").delete().eq("id", id)
    if(error) alert("ลบไม่สำเร็จ")
    else loadMemories()
}

// ===== IMAGE VIEWER =====
function openViewer(src) {
    document.getElementById("viewerImage").src = src
    document.getElementById("imageViewer").style.display = "flex"
}

function closeViewer() {
    document.getElementById("imageViewer").style.display = "none"
}

// ===== HEART EFFECT =====
function createHearts() {
    const container = document.getElementById("heartContainer")
    if(!container) return

    setInterval(() => {
        const heart = document.createElement("div")
        heart.className = "heart"
        heart.innerHTML = "❤"
        heart.style.left = Math.random() * 100 + "vw"
        heart.style.fontSize = (Math.random() * 20 + 10) + "px"
        heart.style.bottom = "-20px"
        
        container.appendChild(heart)

        setTimeout(() => { heart.remove() }, 3000)
    }, 400)
}
