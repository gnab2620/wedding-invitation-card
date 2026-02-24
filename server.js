const express = require('express');
const cors = require('cors');
const path = require('path');
const { addRSVP, getAllRSVPs, getRSVPCount } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ---- API Routes ----

// Submit RSVP
app.post('/api/rsvp', (req, res) => {
    try {
        const { name, guests, message } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Vui lòng nhập họ và tên.'
            });
        }

        const result = addRSVP(name.trim(), guests || 1, message || '');

        res.json({
            success: true,
            message: 'Xác nhận tham dự thành công!',
            id: result.id
        });
    } catch (error) {
        console.error('Error adding RSVP:', error);
        res.status(500).json({
            success: false,
            error: 'Có lỗi xảy ra. Vui lòng thử lại.'
        });
    }
});

// Get all RSVPs (for the couple to review)
app.get('/api/rsvps', (req, res) => {
    try {
        const rsvps = getAllRSVPs();
        const stats = getRSVPCount();

        res.json({
            success: true,
            total: stats.total,
            total_guests: stats.total_guests,
            rsvps
        });
    } catch (error) {
        console.error('Error fetching RSVPs:', error);
        res.status(500).json({
            success: false,
            error: 'Có lỗi xảy ra.'
        });
    }
});

// Fallback — serve index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Wedding Invitation Server running at http://localhost:${PORT}`);
    console.log(`RSVP list: http://localhost:${PORT}/api/rsvps`);
});
