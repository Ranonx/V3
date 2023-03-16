const bookingForm = document.querySelector("#booking-form");
const queryForm = document.querySelector("#query-form");
const successMessage = document.querySelector(".success-message");
const errorMessage = document.querySelector(".error-message");

// Date formatter
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are 0-indexed in JavaScript
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Add leading zeros to month, day, hours, and minutes if necessary
  const paddedMonth = month.toString().padStart(2, "0");
  const paddedDay = day.toString().padStart(2, "0");
  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");

  return `${year}-${paddedMonth}-${paddedDay} ${paddedHours}:${paddedMinutes}`;
}

// function to send a cancel request to the server
async function cancelAppointment(name, phone) {
  const response = await fetch("/cancel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, phone }),
  });

  return response.ok;
}

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  const { booking_action } = data;

  if (booking_action === "update") {
    const { new_appointment_date } = data;
    data.appointment_date = new_appointment_date;
  }

  delete data.new_appointment_date;

  const response = await fetch("/booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const json = await response.json();
    const appointmentDate = formatDate(json.appointment_date);
    successMessage.textContent = `预约成功! 你的预约时间为: ${appointmentDate}.`;
    successMessage.style.display = "block";
    errorMessage.style.display = "none";
  } else {
    const error = await response.json();
    errorMessage.textContent = `预约失败: ${error.message}`;
    errorMessage.style.display = "block";
    successMessage.style.display = "none";
  }
});

queryForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get the input values using getElementById
  const name = document.getElementById("query-name").value;
  const phone = document.getElementById("query-phone").value;

  // Log the input values to the console
  console.log("Name:", name);
  console.log("Phone:", phone);

  // Query the backend for the appointment date
  const response = await fetch("/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, phone }),
  });

  const cancelButton = document.getElementById("cancel-button");
  if (response.ok) {
    const json = await response.json();
    const appointment_date = json.appointment_date;
    console.log(appointment_date);
    document.getElementById(
      "query-result"
    ).textContent = `你的预约时间为: ${formatDate(appointment_date)}.`;

    cancelButton.style.display = "inline"; // Show the cancel button
  } else {
    document.getElementById("query-result").textContent = "查询失败，请重试。";
    cancelButton.style.display = "none"; // Hide the cancel button
  }
});

// Add an event listener for the cancel button
document
  .getElementById("cancel-button")
  .addEventListener("click", async (event) => {
    event.preventDefault(); // Add this line to prevent the default behavior of the button

    const name = document.getElementById("query-name").value;
    const phone = document.getElementById("query-phone").value;

    if (await cancelAppointment(name, phone)) {
      const queryResult = document.getElementById("query-result");
      queryResult.textContent = `已经取消预约: ${queryResult.textContent.slice(
        8
      )}. 你可以返回预约页面进行新的预约`;
      document.getElementById("cancel-button").style.display = "none"; // Hide the cancel button
    } else {
      alert("取消预约失败，请重试。");
    }
  });

document.getElementById("appointment-button").addEventListener("click", () => {
  document.getElementById("appointment-form-container").style.display = "block";
  document.getElementById("query-form-container").style.display = "none";
  document.getElementById("appointment-button").classList.add("active");
  document.getElementById("query-button").classList.remove("active");
});

document.getElementById("query-button").addEventListener("click", () => {
  document.getElementById("appointment-form-container").style.display = "none";
  document.getElementById("query-form-container").style.display = "block";
  document.getElementById("appointment-button").classList.remove("active");
  document.getElementById("query-button").classList.add("active");
});
