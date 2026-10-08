// ---------- helpers ----------
function $(id){ return document.getElementById(id); }

// ---------- greeting (conditionals on the hour) ----------
function setGreeting(){
  var h = new Date().getHours();
  var g;
  if (h < 12) { g = "Good morning"; }
  else if (h < 17) { g = "Good afternoon"; }
  else { g = "Good evening"; }
  $("greeting").innerHTML = g + ", let's check in.";
  $("today").innerHTML = new Date().toDateString();
}

// ---------- theme ----------
function toggleTheme(){
  var root = document.documentElement;
  if (root.getAttribute("data-theme") === "dark") {
    root.setAttribute("data-theme", "light");
    $("themeBtn").innerHTML = "🌙 Dark";
  } else {
    root.setAttribute("data-theme", "dark");
    $("themeBtn").innerHTML = "☀️ Light";
  }
}

// ---------- grades ----------
function gradePoint(m){
  if (m >= 90) return 10;
  else if (m >= 80) return 9;
  else if (m >= 70) return 8;
  else if (m >= 60) return 7;
  else if (m >= 50) return 6;
  else if (m >= 40) return 5;
  else return 0;
}
function calcGrades(){
  var total = 0, points = 0, failed = 0, valid = true;
  for (var i = 1; i <= 5; i++) {
    var m = parseFloat($("m" + i).value);
    if (isNaN(m) || m < 0 || m > 100) { valid = false; break; }
    total += m;
    points += gradePoint(m);
    if (m < 40) failed++;
  }
  if (!valid) {
    $("gradeOut").innerHTML = "<span class='pill bad'>Check input</span><p class='msg'>Enter marks between 0 and 100 for all five subjects.</p>";
    return;
  }
  var pct = total / 5;
  var gpa = points / 5;
  var label, cls;
  if (failed > 0) { label = "Backlog in " + failed + " subject" + (failed > 1 ? "s" : ""); cls = "bad"; }
  else if (pct >= 75) { label = "Distinction"; cls = "good"; }
  else if (pct >= 60) { label = "First class"; cls = "good"; }
  else { label = "Pass"; cls = "warn"; }
  $("gradeOut").innerHTML = "<div class='big'>" + gpa.toFixed(2) + "</div><p class='msg'>GPA out of 10 &middot; " + pct.toFixed(1) + "% overall (" + total + "/500)</p><span class='pill " + cls + "'>" + label + "</span>";
  $("tGpa").innerHTML = gpa.toFixed(2);
}

// ---------- attendance ----------
function calcAttendance(){
  var total = parseFloat($("total").value);
  var att = parseFloat($("attended").value);
  var arc = $("arc");
  if (isNaN(total) || isNaN(att) || total <= 0 || att < 0 || att > total) {
    $("attText").innerHTML = "<span class='pill bad'>Check input</span><p class='msg'>Attended classes cannot be more than classes held.</p>";
    return;
  }
  var pct = (att / total) * 100;
  var cls, color, note;
  if (pct >= 75) {
    cls = "good"; color = "var(--mint)";
    var canMiss = Math.floor(att / 0.75 - total);
    note = "Safe. You can miss " + canMiss + " more class" + (canMiss === 1 ? "" : "es") + " and stay above 75%.";
  } else if (pct >= 65) {
    cls = "warn"; color = "var(--amber)";
    note = "Attend the next " + Math.ceil((0.75 * total - att) / 0.25) + " classes in a row to reach 75%.";
  } else {
    cls = "bad"; color = "var(--rose)";
    note = "Shortage. Attend the next " + Math.ceil((0.75 * total - att) / 0.25) + " classes in a row to reach 75%.";
  }
  arc.style.stroke = color;
  arc.style.strokeDashoffset = 327 - (327 * pct / 100);
  $("attPct").innerHTML = Math.round(pct) + "%";
  $("attText").innerHTML = "<span class='pill " + cls + "'>" + pct.toFixed(1) + "% attendance</span><p class='msg'>" + note + "</p>";
  $("tAtt").innerHTML = Math.round(pct) + "%";
}

// ---------- BMI ----------
function calcBmi(){
  var h = parseFloat($("height").value) / 100;
  var w = parseFloat($("weight").value);
  if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
    $("bmiOut").innerHTML = "<span class='pill bad'>Check input</span><p class='msg'>Enter a valid height and weight.</p>";
    return;
  }
  var bmi = w / (h * h);
  var cat, cls;
  if (bmi < 18.5) { cat = "Underweight"; cls = "warn"; }
  else if (bmi < 25) { cat = "Healthy range"; cls = "good"; }
  else if (bmi < 30) { cat = "Overweight"; cls = "warn"; }
  else { cat = "Obese"; cls = "bad"; }
  $("bmiOut").innerHTML = "<div class='big'>" + bmi.toFixed(1) + "</div><p class='msg'>Healthy BMI is between 18.5 and 24.9.</p><span class='pill " + cls + "'>" + cat + "</span>";
  $("tBmi").innerHTML = bmi.toFixed(1);
}

// ---------- split bill ----------
function calcSplit(){
  var bill = parseFloat($("bill").value);
  var people = parseInt($("people").value);
  var tip = parseFloat($("tip").value);
  if (isNaN(bill) || isNaN(people) || bill <= 0 || people < 1) {
    $("splitOut").innerHTML = "<span class='pill bad'>Check input</span><p class='msg'>Enter a bill above 0 and at least 1 person.</p>";
    return;
  }
  var tipAmt = bill * tip / 100;
  var grand = bill + tipAmt;
  var each = grand / people;
  $("splitOut").innerHTML = "<div class='big'>₹" + each.toFixed(0) + "</div><p class='msg'>per person &middot; bill ₹" + bill + " + tip ₹" + tipAmt.toFixed(0) + " = ₹" + grand.toFixed(0) + "</p>";
  $("tShare").innerHTML = "₹" + each.toFixed(0);
}

// ---------- run once on load so the dashboard looks alive ----------
setGreeting();
calcGrades();
calcBmi();
calcSplit();
setTimeout(calcAttendance, 300);
