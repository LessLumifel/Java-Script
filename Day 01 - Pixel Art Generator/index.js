// กำหนดตัวแปรสำหรับเก็บอ้างอิงถึงองค์ประกอบ HTML ต่างๆ
let container = document.querySelector(".container"); // อ้างอิงถึงองค์ประกอบที่มีคลาส .container
let gridButton = document.getElementById("submit-grid"); // อ้างอิงถึงปุ่มที่มี ID "submit-grid"
let clearGridButton = document.getElementById("clear-grid"); // อ้างอิงถึงปุ่มที่มี ID "clear-grid"
let gridWidth = document.getElementById("width-range"); // อ้างอิงถึงองค์ประกอบที่ใช้กำหนดความกว้างของตาราง
let gridHeight = document.getElementById("height-range"); // อ้างอิงถึงองค์ประกอบที่ใช้กำหนดความสูงของตาราง
let colorButton = document.getElementById("color-input"); // อ้างอิงถึงองค์ประกอบที่ใช้เลือกสี
let eraseBtn = document.getElementById("erase-btn"); // อ้างอิงถึงปุ่มที่ใช้สำหรับลบ
let paintBtn = document.getElementById("paint-btn"); // อ้างอิงถึงปุ่มที่ใช้สำหรับวาด
let widthValue = document.getElementById("width-value"); // อ้างอิงถึงองค์ประกอบที่ใช้แสดงค่าความกว้าง
let heightValue = document.getElementById("height-value"); // อ้างอิงถึงองค์ประกอบที่ใช้แสดงค่าความสูง

// กำหนดวัตถุสำหรับเก็บชื่อเหตุการณ์ของเมาส์และการสัมผัส
let events = {
    mouse: { // เหตุการณ์ของเมาส์
        down: "mousedown", // เหตุการณ์เมื่อคลิกเมาส์
        move: "mousemove", // เหตุการณ์เมื่อเลื่อนเมาส์
        up: "mouseup" // เหตุการณ์เมื่อปล่อยเมาส์
    },
    touch: { // เหตุการณ์ของการสัมผัส
        down: "touchstart", // เหตุการณ์เมื่อเริ่มสัมผัส
        move: "touchmove", // เหตุการณ์เมื่อเลื่อนนิ้วสัมผัส
        up: "touchend" // เหตุการณ์เมื่อปล่อยนิ้วสัมผัส
    },
};

// ตัวแปรสำหรับเก็บประเภทอุปกรณ์
let deviceType = "";

// ตัวแปรสำหรับเก็บสถานะการวาดและการลบ
let draw = false;
let erase = false;

// ฟังก์ชันสำหรับตรวจสอบว่าเป็นอุปกรณ์ที่รองรับการสัมผัสหรือไม่
const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent"); // ทดสอบสร้างเหตุการณ์การสัมผัส
        deviceType = "touch"; // ถ้าสร้างได้ แสดงว่าเป็นอุปกรณ์ที่รองรับการสัมผัส
        return true; // คืนค่า true
    } catch (e) {
        deviceType = "mouse"; // ถ้าสร้างไม่ได้ แสดงว่าเป็นอุปกรณ์ที่ใช้เมาส์
        return false; // คืนค่า false
    }
};

// เรียกใช้ฟังก์ชันตรวจสอบอุปกรณ์
isTouchDevice();

// กำหนดเหตุการณ์เมื่อกดปุ่มสร้างตาราง
gridButton.addEventListener("click", () => {
    container.innerHTML = ""; // ล้างเนื้อหาใน container
    let count = 0; // ตัวนับสำหรับกำหนด ID ของแต่ละช่องในตาราง
    for (let i = 0; i < gridHeight.value; i++) { // วนลูปตามค่าความสูงของตาราง
        count += 2; // เพิ่มค่า count ครั้งละ 2
        let div = document.createElement("div"); // สร้างองค์ประกอบ div ใหม่
        div.classList.add("gridRow"); // เพิ่มคลาส "gridRow" ให้กับ div

        for (let j = 0; j < gridWidth.value; j++) { // วนลูปตามค่าความกว้างของตาราง
            count += 2; // เพิ่มค่า count ครั้งละ 2
            let col = document.createElement("div"); // สร้างองค์ประกอบ div ใหม่สำหรับแต่ละช่อง
            col.classList.add("gridCol"); // เพิ่มคลาส "gridCol" ให้กับ div
            col.setAttribute("id", `gridCol${count}`); // กำหนด ID ให้กับแต่ละช่อง

            // เพิ่มเหตุการณ์เมื่อเริ่มการวาดหรือการลบ
            col.addEventListener(events[deviceType].down, () => {
                draw = true; // ตั้งค่า draw เป็น true
                if (erase) { // ถ้าอยู่ในโหมดลบ
                    col.style.backgroundColor = "transparent"; // เปลี่ยนสีพื้นหลังเป็นโปร่งใส
                } else { // ถ้าอยู่ในโหมดวาด
                    col.style.backgroundColor = colorButton.value; // เปลี่ยนสีพื้นหลังเป็นสีที่เลือก
                }
            });

            // เพิ่มเหตุการณ์เมื่อเลื่อนเมาส์หรือนิ้วสัมผัส
            col.addEventListener(events[deviceType].move, (e) => {
                let elementId = document.elementFromPoint( // หาตำแหน่งองค์ประกอบที่ถูกเลื่อนผ่าน
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX, // ตำแหน่ง X ของเมาส์หรือนิ้วสัมผัส
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY, // ตำแหน่ง Y ของเมาส์หรือนิ้วสัมผัส
                ).id; // ดึงค่า ID ขององค์ประกอบที่ถูกเลื่อนผ่าน
                checker(elementId); // เรียกใช้ฟังก์ชัน checker เพื่อตรวจสอบและเปลี่ยนสี
            });

            // เพิ่มเหตุการณ์เมื่อสิ้นสุดการวาดหรือการลบ
            col.addEventListener(events[deviceType].up, () => {
                draw = false; // ตั้งค่า draw เป็น false
            });

            div.appendChild(col); // เพิ่มช่องในตารางลงในแถว
        }

        container.appendChild(div); // เพิ่มแถวลงใน container
    }
});

// ฟังก์ชันสำหรับตรวจสอบและเปลี่ยนสีของช่องในตาราง
function checker(elementId) {
    let gridColumns = document.querySelectorAll(".gridCol"); // ดึงข้อมูลทุกช่องในตาราง
    gridColumns.forEach((element) => { // วนลูปผ่านทุกช่องในตาราง
        if (elementId == element.id) { // ถ้า ID ของช่องตรงกับที่ถูกเลื่อนผ่าน
            if (draw && !erase) { // ถ้าอยู่ในโหมดวาดและกำลังวาด
                element.style.backgroundColor = colorButton.value; // เปลี่ยนสีพื้นหลังของช่อง
            } else if (draw && erase) { // ถ้าอยู่ในโหมดลบและกำลังลบ
                element.style.backgroundColor = "transparent"; // เปลี่ยนสีพื้นหลังของช่องเป็นโปร่งใส
            }
        }
    });
}

// กำหนดเหตุการณ์เมื่อกดปุ่มล้างตาราง
clearGridButton.addEventListener("click", () => {
    container.innerHTML = ""; // ล้างเนื้อหาใน container
});

// กำหนดเหตุการณ์เมื่อกดปุ่มลบ
eraseBtn.addEventListener("click", () => {
    erase = true; // ตั้งค่า erase เป็น true
});

// กำหนดเหตุการณ์เมื่อกดปุ่มวาด
paintBtn.addEventListener("click", () => {
    erase = false; // ตั้งค่า erase เป็น false
});

// กำหนดเหตุการณ์เมื่อมีการเปลี่ยนค่าความกว้างของตาราง
gridWidth.addEventListener("input", () => {
    widthValue.innerHTML = gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value; // อัพเดตค่าแสดงผลความกว้าง
});

// กำหนดเหตุการณ์เมื่อมีการเปลี่ยนค่าความสูงของตาราง
gridHeight.addEventListener("input", () => {
    heightValue.innerHTML = gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value; // อัพเดตค่าแสดงผลความสูง
});

// กำหนดเหตุการณ์เมื่อโหลดหน้าเว็บ
window.onload = () => {
    gridHeight.value = 0; // ตั้งค่าความสูงของตารางเป็น 0
    gridWidth.value = 0; // ตั้งค่าความกว้างของตารางเป็น 0
};
