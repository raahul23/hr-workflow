# 🧩 HR Workflow Builder (React + Vite + React Flow)

A visual workflow builder for creating HR automation flows using drag-and-drop nodes like **Start, Task, Approval, Automated, and End**.  
You can connect nodes, configure them, run simulations, and export/import workflows as JSON.

---

## 🚀 Features Implemented

✅ Drag & Drop Node Creation  
✅ Connect Nodes with Edges  
✅ Multiple Node Types (Start, Task, Approval, Automated, End)  
✅ Node Configuration Panel  
✅ Workflow Simulation  
✅ Save Workflow as JSON  
✅ Load Workflow from JSON  
✅ Undo / Redo  
✅ Auto Layout  
✅ MiniMap & Zoom Controls  
✅ Visual Error Highlighting (Unreachable nodes)  
✅ Professional UI Layout  

---

## 🛠️ Tech Stack

- ⚡ Vite  
- ⚛️ React  
- 🧠 React Flow  
- 🎨 Custom CSS  
- 🟦 TypeScript  

---

## 📁 Project Structure

hr-workflow/
├── public/
├── src/
│ ├── workflow/
│ │ ├── components/
│ │ ├── nodes/
│ │ └── api/
│ ├── App.tsx
│ └── main.tsx
├── package.json
├── vite.config.ts
└── README.md

yaml
Copy code

---

## ▶️ How to Run the Project

### 1️⃣ Install Dependencies
```bash
npm install
2️⃣ Run Development Server
bash
Copy code
npm run dev
Open in browser:

arduino
Copy code
http://localhost:5173
✅ How to Use
Add nodes using Node Types panel

Drag nodes inside the canvas

Connect nodes using edge handles

Select any node to configure it

Click Run Simulation

Save or Load workflow JSON

Use Undo / Redo / Auto Layout for editing

🧪 Simulation Output Example
vbnet
Copy code
Step 1: START  
Step 2: TASK  
Step 3: APPROVAL  
Step 4: AUTOMATED  
Step 5: END  
🔒 Validation Rules
Only one Start node allowed

All nodes must be reachable from Start

End node required for valid workflow

Errors are shown with red highlight

🌟 Bonus Features (Advanced)
✅ JSON Export / Import
✅ Undo / Redo
✅ Auto Layout
✅ Visual Validation
✅ Mini Map + Zoom

👨‍💻 Developed By
Raahul U
B.tech Computer Science Engneering  
Workflow Automation Builder Project

📌 Notes
This project was built as part of a workflow visualizer prototype for HR automation systems and can be extended to real-world enterprise use.
