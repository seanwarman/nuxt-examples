var sg_div = document.createElement("div");

sg_div.innerHTML = "<h1>You have been selected for a survey</h1><p>We appreciate your feedback!</p><p><a href=\"https://survey.alchemer.com/s3/6606957/e0daa65f7efa\">Please click here start it now.</a> </p> <a href=\"#\" onclick=\"document.getElementById('sg-popup').style.display = 'none';return false;\">No, thank you.</a> ";

sg_div.id = "sg-popup";
sg_div.style.position = "absolute";
sg_div.style.width = "500px";
sg_div.style.top = "100px";
sg_div.style.left = "400px";
sg_div.style.backgroundColor = "#ffffff";
sg_div.style.borderColor = "#000000";
sg_div.style.borderStyle = "solid";
sg_div.style.padding = "20px";
sg_div.style.fontSize = "16px";
document.body.appendChild(sg_div);