const bookingForm = document.querySelector("#booking-form");
const queryForm = document.querySelector("#query-form");
const successMessage = document.querySelector(".success-message");
const errorMessage = document.querySelector(".error-message");

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
    successMessage.textContent = "预约成功.";
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

  const name = document.querySelector("input[name='name']").value;
  const phone = document.querySelector("input[name='phone']").value;

  // Query the backend for the appointment date
  const response = await fetch("/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, phone }),
  });

  if (response.ok) {
    const json = await response.json();
    const appointment_date = json.data[0].appointment_date;
    document.getElementById(
      "query-result"
    ).textContent = `你的预约时间为: ${appointment_date}`;
  } else {
    document.getElementById("query-result").textContent = "查询失败，请重试。";
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
