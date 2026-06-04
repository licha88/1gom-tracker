const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

var visits = {};
var total = 0;

// Lấy ngày theo múi giờ VN (UTC+7)
function getVNDate() {
  var now = new Date();
  var vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return vnTime.toISOString().slice(0, 10);
}

function getVNDateTime() {
  var now = new Date();
  var vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return vnTime.toISOString().replace('T', ' ').slice(0, 19) + ' (GMT+7)';
}

// Tăng counter
app.get('/hit', function(req, res) {
  total++;
  var today = getVNDate();
  visits[today] = (visits[today] || 0) + 1;
  var keys = Object.keys(visits).sort();
  if (keys.length > 30) delete visits[keys[0]];
  res.json({ total: total, today: visits[today] });
});

// API stats
app.get('/stats', function(req, res) {
  var today = getVNDate();
  res.json({ total: total, today: visits[today] || 0, days: visits });
});

// Trang admin
app.get('/admin', function(req, res) {
  var today = getVNDate();
  var todayN = visits[today] || 0;
  var now = getVNDateTime();

  var rows = '';
  var days = Object.keys(visits).sort().reverse();
  for (var i = 0; i < days.length; i++) {
    rows += '<tr>' +
      '<td style="padding:10px 0;color:#8b949e;font-size:14px">' + days[i] + '</td>' +
      '<td style="padding:10px 0;color:#4ade80;font-weight:bold;font-size:18px;text-align:right">' + visits[days[i]] + ' lượt</td>' +
      '</tr>';
  }

  res.send('<!DOCTYPE html><html><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Traffic 1gom.run</title></head>' +
    '<body style="margin:0;background:#0d1117;font-family:sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center">' +
    '<div style="width:100%;max-width:440px;padding:24px;color:#fff">' +

    '<h2 style="color:#f59e0b;margin:0 0 4px">📊 Traffic - 1gom.run</h2>' +
    '<div style="color:#555;font-size:12px;margin-bottom:20px">🕐 ' + now + '</div>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">' +

    '<div style="background:#161b22;border:1px solid #30363d;border-radius:12px;padding:20px;text-align:center">' +
    '<div style="color:#8b949e;font-size:11px;margin-bottom:8px">TỔNG LƯỢT</div>' +
    '<div style="color:#38bdf8;font-size:40px;font-weight:bold">' + total + '</div>' +
    '</div>' +

    '<div style="background:#161b22;border:1px solid #30363d;border-radius:12px;padding:20px;text-align:center">' +
    '<div style="color:#8b949e;font-size:11px;margin-bottom:8px">HÔM NAY (' + today + ')</div>' +
    '<div style="color:#4ade80;font-size:40px;font-weight:bold">' + todayN + '</div>' +
    '</div>' +

    '</div>' +

    '<div style="background:#161b22;border:1px solid #30363d;border-radius:12px;padding:16px;margin-bottom:16px">' +
    '<div style="color:#f59e0b;font-size:13px;margin-bottom:12px">📅 30 ngày gần nhất (giờ VN)</div>' +
    '<table style="width:100%;border-collapse:collapse">' + rows + '</table>' +
    (rows === '' ? '<div style="color:#444;text-align:center;padding:16px">Chưa có dữ liệu</div>' : '') +
    '</div>' +

    '<button onclick="location.reload()" style="width:100%;background:#f59e0b;color:#000;border:none;padding:12px;border-radius:10px;font-weight:bold;cursor:pointer;font-size:15px">🔄 Làm mới</button>' +

    '</div></body></html>');
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Tracker running on port ' + PORT);
});
