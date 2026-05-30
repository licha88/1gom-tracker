const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Lưu data trong memory (Railway giữ nguyên khi không restart)
var visits = {};
var total = 0;

// Tăng counter
app.get('/hit', function(req, res) {
  total++;
  var today = new Date().toISOString().slice(0,10);
  visits[today] = (visits[today] || 0) + 1;
  // Giữ 30 ngày
  var keys = Object.keys(visits).sort();
  if(keys.length > 30) delete visits[keys[0]];
  res.json({ total: total, today: visits[today] });
});

// Lấy data cho admin
app.get('/stats', function(req, res) {
  var today = new Date().toISOString().slice(0,10);
  res.json({
    total: total,
    today: visits[today] || 0,
    days: visits
  });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Tracker running on port ' + PORT);
});
