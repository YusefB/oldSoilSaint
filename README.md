# 🌱 Soil Saint

**Soil Saint** is a full-stack web app that lets users ask plain-English farming questions and get intelligent, data-driven answers. It uses the **OpenAI API** to convert natural language into SQL queries that fetch information from a **MySQL** database.

---

## 🧠 What It Does

Users can type questions like:

> “What crops grow best in acidic soil during spring?”

The app responds with helpful insights pulled from a structured database of farming knowledge.

---

## 🛠️ How It Works

1. **Frontend (HTML/CSS/JavaScript)**  
   Provides a clean UI for users to enter their questions.

2. **Backend (Python)**  
   Receives the question and sends it to the OpenAI API for interpretation.

3. **OpenAI API Integration**  
   Converts the user’s natural language input into an appropriate **MySQL query**.

4. **MySQL Database**  
   Executes the generated query to return relevant farming data.

5. **Response to User**  
   The results are formatted and shown to the user in a helpful, human-readable way.

---

## 🧪 Example

> User types:  
> _"What crops are best for sandy soil in July?"_

> System sends to OpenAI →  
> `SELECT crop_name FROM crops WHERE soil_type = 'sandy' AND month = 'July';`

> MySQL returns results →  
> _"Corn, Sunflowers, and Peanuts grow well in sandy soil during July."_

---

## ⚠️ Status

✅ This app worked as of the last deployment. It may require updates or debugging if reused.

---

## 🧰 Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python  
- **Database:** MySQL  
- **AI Integration:** OpenAI API  
- **Deploy**
