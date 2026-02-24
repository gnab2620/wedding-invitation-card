const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'wedding_rsvp.json');

function loadDB() {
    try {
        if (fs.existsSync(DB_PATH)) {
            const data = fs.readFileSync(DB_PATH, 'utf-8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('Error loading database:', e);
    }
    return { rsvps: [], nextId: 1 };
}

function saveDB(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

function addRSVP(name, guests, message) {
    const db = loadDB();
    const entry = {
        id: db.nextId++,
        name,
        guests: guests || 1,
        message: message || '',
        created_at: new Date().toISOString()
    };
    db.rsvps.push(entry);
    saveDB(db);
    return { id: entry.id };
}

function getAllRSVPs() {
    const db = loadDB();
    return db.rsvps.slice().reverse(); // newest first
}

function getRSVPCount() {
    const db = loadDB();
    const total = db.rsvps.length;
    const total_guests = db.rsvps.reduce((sum, r) => sum + (r.guests || 1), 0);
    return { total, total_guests };
}

module.exports = { addRSVP, getAllRSVPs, getRSVPCount };
